'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Shirt, Gem, Package } from 'lucide-react';
import { ImageUpload } from '@/components/admin/ImageUpload';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  type: 'tshirt' | 'bracelet';
  productCount?: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('tshirt');

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    type: 'tshirt' as 'tshirt' | 'bracelet',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      const data = await response.json();
      
      // Transform categories with type info based on naming convention
      const typedCategories = data.map((cat: ProductCategory) => ({
        ...cat,
        type: cat.slug.includes('tshirt') || cat.name.toLowerCase().includes('t-shirt') 
          ? 'tshirt' as const 
          : cat.slug.includes('bracelet') || cat.name.toLowerCase().includes('bracelet')
            ? 'bracelet' as const
            : cat.name.toLowerCase().includes('shirt')
              ? 'tshirt' as const
              : 'bracelet' as const,
      }));
      
      setCategories(typedCategories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Auto-generate slug from name
    if (name === 'name') {
      const baseSlug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const slug = formData.type === 'tshirt'
        ? `tshirt-${baseSlug}`
        : `bracelet-${baseSlug}`;
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleTypeChange = (type: 'tshirt' | 'bracelet') => {
    setFormData(current => {
      const nameSlug = current.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const newSlug = type === 'tshirt' ? `tshirt-${nameSlug}` : `bracelet-${nameSlug}`;
      return { ...current, type, slug: newSlug };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingId
        ? `/api/admin/categories/${editingId}`
        : '/api/admin/categories';

      const response = await fetch(url, {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchCategories();
        resetForm();
        toast.success(editingId ? 'Category updated!' : 'Category created!');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save category');
      }
    } catch (error) {
      console.error('Failed to save category:', error);
      toast.error('Failed to save category');
    }
  };

  const handleEdit = (category: ProductCategory) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      image: category.image || '',
      type: category.type,
    });
    setShowForm(true);
    setActiveTab(category.type);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchCategories();
        toast.success('Category deleted');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Failed to delete category:', error);
      toast.error('Failed to delete category');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', slug: '', description: '', image: '', type: activeTab as 'tshirt' | 'bracelet' });
    setEditingId(null);
    setShowForm(false);
  };

  const tshirtCategories = categories.filter(c => c.type === 'tshirt');
  const braceletCategories = categories.filter(c => c.type === 'bracelet');

  const CategoryCard = ({ category }: { category: ProductCategory }) => (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
      <div className="flex items-start gap-4">
        {category.image ? (
          <Image
            src={category.image}
            alt={category.name}
            width={80}
            height={80}
            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
          />
        ) : (
          <div className={`w-20 h-20 rounded-lg flex items-center justify-center flex-shrink-0 ${
            category.type === 'tshirt' ? 'bg-blue-100' : 'bg-purple-100'
          }`}>
            {category.type === 'tshirt' ? (
              <Shirt className="w-8 h-8 text-blue-600" />
            ) : (
              <Gem className="w-8 h-8 text-purple-600" />
            )}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg truncate">{category.name}</h3>
            <Badge variant={category.type === 'tshirt' ? 'default' : 'secondary'}>
              {category.type === 'tshirt' ? 'T-Shirt' : 'Bracelet'}
            </Badge>
          </div>
          <p className="text-sm text-gray-500 mt-1 font-mono">{category.slug}</p>
          {category.description && (
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{category.description}</p>
          )}
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleEdit(category)}
        >
          <Edit2 className="h-3 w-3 mr-1" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleDelete(category.id)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-3 w-3 mr-1" />
          Delete
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Product Categories</h1>
          <p className="text-gray-600 mt-1">Organize your T-Shirts and Bracelets</p>
        </div>
        {!showForm && (
          <Button onClick={() => {
            setShowForm(true);
            setFormData(prev => ({ ...prev, type: activeTab as 'tshirt' | 'bracelet' }));
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{editingId ? 'Edit Category' : 'New Category'}</CardTitle>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Category Type *</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      checked={formData.type === 'tshirt'}
                      onChange={() => handleTypeChange('tshirt')}
                      className="w-4 h-4"
                    />
                    <Shirt className="w-4 h-4 text-blue-600" />
                    <span>T-Shirt</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      checked={formData.type === 'bracelet'}
                      onChange={() => handleTypeChange('bracelet')}
                      className="w-4 h-4"
                    />
                    <Gem className="w-4 h-4 text-purple-600" />
                    <span>Bracelet</span>
                  </label>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Category Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Ocean Collection"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    required
                    placeholder="ocean-collection"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full min-h-[80px] px-3 py-2 border rounded-md"
                  placeholder="Describe this category..."
                />
              </div>

              <div className="space-y-2">
                <ImageUpload
                  label="Category Image"
                  helperText="Drag and drop an image or click to browse (max 5MB)"
                  currentImage={formData.image || undefined}
                  onUploadComplete={(url) => setFormData(prev => ({ ...prev, image: url }))}
                  onRemove={() => setFormData(prev => ({ ...prev, image: '' }))}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit">
                  {editingId ? 'Save Changes' : 'Create Category'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={(v) => {
        setActiveTab(v);
        if (!showForm) {
          setFormData(prev => ({ ...prev, type: v as 'tshirt' | 'bracelet' }));
        }
      }}>
        <TabsList>
          <TabsTrigger value="tshirt" className="flex items-center gap-2">
            <Shirt className="w-4 h-4" />
            T-Shirts ({tshirtCategories.length})
          </TabsTrigger>
          <TabsTrigger value="bracelet" className="flex items-center gap-2">
            <Gem className="w-4 h-4" />
            Bracelets ({braceletCategories.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tshirt" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shirt className="w-5 h-5 text-blue-600" />
                T-Shirt Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : tshirtCategories.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 mb-4">No T-Shirt categories yet</p>
                  <Button onClick={() => {
                    setActiveTab('tshirt');
                    setShowForm(true);
                    setFormData(prev => ({ ...prev, type: 'tshirt', slug: 'tshirt-' }));
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create your first T-Shirt category
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {tshirtCategories.map((category) => (
                    <CategoryCard key={category.id} category={category} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bracelet" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gem className="w-5 h-5 text-purple-600" />
                Bracelet Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : braceletCategories.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 mb-4">No Bracelet categories yet</p>
                  <Button onClick={() => {
                    setActiveTab('bracelet');
                    setShowForm(true);
                    setFormData(prev => ({ ...prev, type: 'bracelet', slug: 'bracelet-' }));
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create your first Bracelet category
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {braceletCategories.map((category) => (
                    <CategoryCard key={category.id} category={category} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
