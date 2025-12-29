import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import { HfInference } from '@huggingface/inference';

export type AIProvider = 'gemini' | 'claude' | 'huggingface';

export interface ModelConfig {
  name: string;
  displayName: string;
}

export const AI_MODELS: Record<AIProvider, ModelConfig[]> = {
  gemini: [
    { name: 'gemini-1.5-flash', displayName: 'Gemini 1.5 Flash' },
    { name: 'gemini-1.5-pro', displayName: 'Gemini 1.5 Pro' },
    // Add other Gemini models as needed
  ],
  claude: [
    { name: 'claude-3-haiku-20240307', displayName: 'Claude 3 Haiku' },
    { name: 'claude-3-opus-20240229', displayName: 'Claude 3 Opus' },
    { name: 'claude-3-sonnet-20240229', displayName: 'Claude 3 Sonnet' },
    // Add other Claude models as needed
  ],
  huggingface: [
    { name: 'mistralai/Mixtral-8x7B-Instruct-v0.1', displayName: 'Mixtral 8x7B Instruct' },
    // Add other Hugging Face models as needed
  ],
};

export interface BlogGenerationParams {
  topic: string;
  keywords: string[];
  tone?: string;
  length?: 'short' | 'medium' | 'long';
  provider: AIProvider;
  model: string; // Model name to use for the selected provider
}

export interface GeneratedBlog {
  title: string;
  content: string; // HTML content
  excerpt: string;
  tags: string[];
  category: string;
}

export class BlogGenerator {
  private gemini?: GoogleGenerativeAI;
  private claude?: Anthropic;
  private huggingface?: HfInference;

  constructor() {
    if (process.env.GOOGLE_GENERATIVE_AI_KEY) {
      this.gemini = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_KEY);
    }
    if (process.env.ANTHROPIC_API_KEY) {
      this.claude = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
    }
    if (process.env.HUGGINGFACE_API_KEY) {
      this.huggingface = new HfInference(process.env.HUGGINGFACE_API_KEY);
    }
  }

  async generate(params: BlogGenerationParams): Promise<GeneratedBlog> {
    const prompt = this.buildPrompt(params);

    switch (params.provider) {
      case 'gemini':
        return this.generateWithGemini(prompt, params.model);
      case 'claude':
        return this.generateWithClaude(prompt, params.model);
      case 'huggingface':
        return this.generateWithHuggingFace(prompt, params.model);
      default:
        throw new Error('Invalid AI provider selected');
    }
  }

  private buildPrompt(params: BlogGenerationParams): string {
    return `
      You are an expert marine conservation blogger for ShennaStudio, a jewelry brand that supports ocean conservation.
      Write a blog post about: "${params.topic}".
      
      Keywords to include: ${params.keywords.join(', ')}.
      Tone: ${params.tone || 'Educational and Inspiring'}.
      Length: ${params.length || 'medium'} (Short: ~500 words, Medium: ~1000 words, Long: ~1500 words).

      Return the result as a strictly valid JSON object with the following structure:
      {
        "title": "Catchy Blog Title",
        "content": "HTML formatted body content (use <h2>, <h3>, <p>, <ul>, <li>)",
        "excerpt": "A brief summary (max 160 chars)",
        "tags": ["tag1", "tag2", "tag3"],
        "category": "One of: Conservation, Marine Life, Ecosystems, Community"
      }
      
      Do not include markdown formatting (like json code blocks) around the response. Just the raw JSON string.
    `;
  }

  private async generateWithGemini(prompt: string, modelName: string): Promise<GeneratedBlog> {
    if (!this.gemini) throw new Error('Gemini API key not configured');
    
    // Use the specified model name
    const model = this.gemini.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    return this.parseResponse(text);
  }

  private async generateWithClaude(prompt: string, modelName: string): Promise<GeneratedBlog> {
    if (!this.claude) throw new Error('Claude API key not configured');

    const msg = await this.claude.messages.create({
      model: modelName, // Use the specified model name
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = msg.content[0].type === 'text' ? msg.content[0].text : '';
    return this.parseResponse(text);
  }

  private async generateWithHuggingFace(prompt: string, modelName: string): Promise<GeneratedBlog> {
    if (!this.huggingface) throw new Error('Hugging Face API key not configured');

    const result = await this.huggingface.textGeneration({
      model: modelName, // Use the specified model name
      inputs: prompt,
      parameters: {
        max_new_tokens: 2000,
        return_full_text: false,
      }
    });

    return this.parseResponse(result.generated_text);
  }

  private parseResponse(text: string): GeneratedBlog {
    try {
      // Clean up potential markdown code blocks if the model ignored instructions
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const json = JSON.parse(cleaned);
      
      // Basic validation
      if (!json.title || !json.content) {
        throw new Error('Invalid JSON structure from AI');
      }
      
      return json;
    } catch (error) {
      console.error('Failed to parse AI response:', text, error);
      throw new Error('Failed to parse AI response. The model might have failed to produce valid JSON.');
    }
  }
}