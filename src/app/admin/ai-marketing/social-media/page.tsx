'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Instagram, Facebook, Twitter, Sparkles, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

interface GeneratedPost {
  platform: string;
  caption: string;
  hashtags: string[];
  scheduledAt: Date;
}

export default function SocialMediaAutomation() {
  const [loading, setLoading] = useState(false);
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [platform, setPlatform] = useState<'instagram' | 'facebook' | 'twitter'>('instagram');
  const [generatedPosts, setGeneratedPosts] = useState<GeneratedPost[]>([]);

  const handleGeneratePost = async () => {
    if (!productName || !productDescription || !productPrice) {
      toast.error('Please fill in all product details');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin/ai-marketing/generate-social-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: {
            name: productName,
            description: productDescription,
            price: parseFloat(productPrice),
            category: 'jewelry'
          },
          platform
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate post');
      }

      const data = await response.json();
      setGeneratedPosts(prev => [...prev, {
        platform,
        caption: data.caption,
        hashtags: data.hashtags,
        scheduledAt: new Date()
      }]);

      toast.success('Post generated successfully!');
    } catch (error) {
      console.error('Generate post error:', error);
      toast.error('Failed to generate post');
    } finally {
      setLoading(false);
    }
  };

  const handleSchedulePost = async (post: GeneratedPost) => {
    try {
      const response = await fetch('/api/admin/ai-marketing/schedule-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
      });

      if (!response.ok) throw new Error('Failed to schedule post');
      
      toast.success('Post scheduled successfully!');
    } catch (error) {
      console.error('Schedule error:', error);
      toast.error('Failed to schedule post');
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <Instagram className="w-5 h-5 text-pink-600" />;
      case 'facebook': return <Facebook className="w-5 h-5 text-blue-600" />;
      case 'twitter': return <Twitter className="w-5 h-5 text-sky-500" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
          AI Social Media Manager
        </h1>
        <p className="text-slate-600 mt-2">Generate engaging posts with AI for Instagram, Facebook, and more</p>
      </div>

      {/* Post Generator */}
      <Card className="border-slate-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Generate AI-Powered Post
          </CardTitle>
          <CardDescription>Create engaging social media content automatically</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="product-name">Product Name</Label>
              <Input
                id="product-name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Ocean Wave Bracelet"
              />
            </div>
            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                placeholder="29.99"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Product Description</Label>
            <Textarea
              id="description"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              placeholder="Describe your beautiful ocean-inspired piece..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="platform">Platform</Label>
            <Select value={platform} onValueChange={(val: string) => setPlatform(val)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instagram">
                  <div className="flex items-center gap-2">
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </div>
                </SelectItem>
                <SelectItem value="facebook">
                  <div className="flex items-center gap-2">
                    <Facebook className="w-4 h-4" />
                    Facebook
                  </div>
                </SelectItem>
                <SelectItem value="twitter">
                  <div className="flex items-center gap-2">
                    <Twitter className="w-4 h-4" />
                    Twitter
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleGeneratePost}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {loading ? 'Generating...' : 'Generate Post with AI'}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Posts */}
      {generatedPosts.length > 0 && (
        <Card className="border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle>Generated Posts ({generatedPosts.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {generatedPosts.map((post, index) => (
              <div key={index} className="p-4 border border-slate-200 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getPlatformIcon(post.platform)}
                    <span className="font-semibold capitalize">{post.platform}</span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleSchedulePost(post)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Post
                  </Button>
                </div>

                <div className="bg-slate-50 p-3 rounded">
                  <p className="text-sm whitespace-pre-wrap">{post.caption}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {post.hashtags.slice(0, 10).map((tag, i) => (
                    <span key={i} className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-100 rounded-lg">
                <Instagram className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Instagram Posts</p>
                <p className="text-2xl font-bold">{generatedPosts.filter(p => p.platform === 'instagram').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Facebook className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Facebook Posts</p>
                <p className="text-2xl font-bold">{generatedPosts.filter(p => p.platform === 'facebook').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Generated</p>
                <p className="text-2xl font-bold">{generatedPosts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
