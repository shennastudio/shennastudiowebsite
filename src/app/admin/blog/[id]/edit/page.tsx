'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Eye, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import toast from 'react-hot-toast';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featuredImage: string | null;
  category: string | null;
  tags: string[];
  featured: boolean;
  published: boolean;
  author: {
    id: string;
    name: string | null;
    email: string;
  };
}

export default function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    category: '',
    tags: [] as string[],
    featured: false,
    published: false,
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchPost();
  }, [resolvedParams.id]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/admin/blog/${resolvedParams.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch blog post');
      }
      const data = await response.json();
      setPost(data);
      setFormData({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt || '',
        content: data.content,
        featuredImage: data.featuredImage || '',
        category: data.category || '',
        tags: data.tags || [],
        featured: data.featured,
        published: data.published,
      });
    } catch (error) {
      console.error('Error fetching blog post:', error);
      toast.error('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag),
    });
  };

  const handleSubmit = async (publish?: boolean) => {
    if (!formData.title || !formData.slug || !formData.content) {
      toast.error('Please fill in all required fields (Title, Slug, and Content)');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/admin/blog/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          published: publish !== undefined ? publish : formData.published,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update blog post');
      }

      toast.success('Blog post updated successfully!');
      router.push('/admin/blog');
      router.refresh();
    } catch (error) {
      console.error('Error updating blog post:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update blog post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-cyan-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Blog post not found</p>
          <Link href="/admin/blog">
            <Button>Back to Blog Posts</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/admin/blog">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 via-cyan-900 to-teal-900 bg-clip-text text-transparent">
              Edit Blog Post
            </h1>
            <p className="text-slate-600 mt-2">
              Last updated by {post.author.name || post.author.email}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {formData.published ? (
            <Button
              variant="outline"
              onClick={() => handleSubmit(false)}
              disabled={saving}
              className="hover:bg-slate-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Unpublishing...' : 'Unpublish'}
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => handleSubmit(false)}
              disabled={saving}
              className="hover:bg-slate-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Draft'}
            </Button>
          )}
          <Button
            onClick={() => handleSubmit(true)}
            disabled={saving}
            className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700"
          >
            <Eye className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : formData.published ? 'Update & Keep Published' : 'Save & Publish'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Slug */}
          <Card className="border-slate-200/60 shadow-lg">
            <CardHeader className="border-b border-slate-200/60 bg-gradient-to-r from-slate-50 to-white">
              <CardTitle>Post Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter blog post title"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="url-friendly-slug"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-mono text-sm"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">
                  URL: /blog/{formData.slug || 'your-post-slug'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Excerpt
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Brief summary of your blog post"
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Content Editor */}
          <Card className="border-slate-200/60 shadow-lg">
            <CardHeader className="border-b border-slate-200/60 bg-gradient-to-r from-slate-50 to-white">
              <CardTitle>
                Content <span className="text-red-500">*</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <RichTextEditor
                content={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
                placeholder="Write your blog post content here..."
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Badge */}
          <Card className="border-slate-200/60 shadow-lg">
            <CardContent className="pt-6">
              {formData.published ? (
                <div className="flex items-center gap-2 text-green-700">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-semibold">Published</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-amber-700">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <span className="font-semibold">Draft</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Featured Image */}
          <Card className="border-slate-200/60 shadow-lg">
            <CardHeader className="border-b border-slate-200/60 bg-gradient-to-r from-slate-50 to-white">
              <CardTitle className="text-base">Featured Image</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <input
                type="url"
                value={formData.featuredImage}
                onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
              />
              {formData.featuredImage && (
                <div className="mt-4 rounded-lg overflow-hidden border border-slate-200">
                  <img
                    src={formData.featuredImage}
                    alt="Featured preview"
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Category */}
          <Card className="border-slate-200/60 shadow-lg">
            <CardHeader className="border-b border-slate-200/60 bg-gradient-to-r from-slate-50 to-white">
              <CardTitle className="text-base">Category</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Conservation, Wildlife"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </CardContent>
          </Card>

          {/* Tags */}
          <Card className="border-slate-200/60 shadow-lg">
            <CardHeader className="border-b border-slate-200/60 bg-gradient-to-r from-slate-50 to-white">
              <CardTitle className="text-base">Tags</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Add a tag"
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                />
                <Button
                  type="button"
                  onClick={handleAddTag}
                  size="sm"
                  className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm border border-cyan-200"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-cyan-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card className="border-slate-200/60 shadow-lg">
            <CardHeader className="border-b border-slate-200/60 bg-gradient-to-r from-slate-50 to-white">
              <CardTitle className="text-base">Settings</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-cyan-600 border-slate-300 rounded focus:ring-2 focus:ring-cyan-500"
                />
                <span className="text-sm font-medium text-slate-700">Feature this post</span>
              </label>
              <p className="text-xs text-slate-500 mt-1 ml-6">
                Featured posts appear prominently on the blog page
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
