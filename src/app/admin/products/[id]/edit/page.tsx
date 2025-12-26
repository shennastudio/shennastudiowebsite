'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, X, Loader2 } from 'lucide-react';

interface ProductVariant {
  id?: string;
  name: string;
  sku: string;
  price: string;
  stock: string;
  size?: string;
  color?: string;
  material?: string;
}

interface ProductImage {
  id?: string;
  url: string;
  position: number;
}

interface Category {
  id: string;
  name: string;
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    sku: '',
    basePrice: '',
    featured: false,
    conservationPercentage: '10',
    conservationFocus: '',
    categoryId: '',
  });

  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, [params.id]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/admin/products/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch product');

      const product = await response.json();

      setFormData({
        name: product.name || '',
        slug: product.slug || '',
        description: product.description || '',
        sku: product.sku || '',
        basePrice: product.basePrice.toString(),
        featured: product.featured || false,
        conservationPercentage: product.conservationPercentage.toString(),
        conservationFocus: product.conservationFocus || '',
        categoryId: product.categoryId || '',
      });

      setVariants(
        product.variants.map((v: any) => ({
          id: v.id,
          name: v.name,
          sku: v.sku,
          price: v.price.toString(),
          stock: v.stock.toString(),
          size: v.size || '',
          color: v.color || '',
          material: v.material || '',
        }))
      );

      setImages(product.images.map((img: any) => img.url));

      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Auto-generate slug from name
    if (name === 'name') {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const addVariant = () => {
    setVariants([...variants, {
      name: '',
      sku: '',
      price: formData.basePrice,
      stock: '0',
      size: '',
      color: '',
      material: '',
    }]);
  };

  const removeVariant = (index: number) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index));
    }
  };

  const updateVariant = (index: number, field: string, value: string) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  const addImage = () => {
    setImages([...images, '']);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const updateImage = (index: number, value: string) => {
    const updated = [...images];
    updated[index] = value;
    setImages(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/products/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          basePrice: parseFloat(formData.basePrice),
          conservationPercentage: parseFloat(formData.conservationPercentage),
          variants: variants.map(v => ({
            name: v.name,
            sku: v.sku,
            price: parseFloat(v.price),
            stock: parseInt(v.stock),
            size: v.size,
            color: v.color,
            material: v.material,
          })),
          images: images.filter(img => img.trim() !== '').map((url, index) => ({
            url,
            position: index,
          })),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update product');
      }

      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Product</h1>
          <p className="text-gray-600 mt-1">Update product information</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Ocean Wave Bracelet"
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
                  placeholder="ocean-wave-bracelet"
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
                className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                placeholder="Handcrafted bracelet inspired by ocean waves..."
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  required
                  placeholder="OWB-001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="basePrice">Base Price *</Label>
                <Input
                  id="basePrice"
                  name="basePrice"
                  type="number"
                  step="0.01"
                  value={formData.basePrice}
                  onChange={handleInputChange}
                  required
                  placeholder="29.99"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="conservationPercentage">Conservation %</Label>
                <Input
                  id="conservationPercentage"
                  name="conservationPercentage"
                  type="number"
                  step="0.1"
                  value={formData.conservationPercentage}
                  onChange={handleInputChange}
                  placeholder="10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="conservationFocus">Conservation Focus</Label>
              <Input
                id="conservationFocus"
                name="conservationFocus"
                value={formData.conservationFocus}
                onChange={handleInputChange}
                placeholder="Sea Turtle Conservation - South Padre Island"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryId">Category</Label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">No category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="rounded"
              />
              <Label htmlFor="featured" className="cursor-pointer">
                Featured Product
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Product Variants */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Product Variants</CardTitle>
              <Button type="button" onClick={addVariant} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Variant
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {variants.map((variant, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Variant {index + 1}</h4>
                  {variants.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeVariant(index)}
                      variant="ghost"
                      size="sm"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Variant Name *</Label>
                    <Input
                      value={variant.name}
                      onChange={(e) => updateVariant(index, 'name', e.target.value)}
                      required
                      placeholder="Small - Blue"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>SKU *</Label>
                    <Input
                      value={variant.sku}
                      onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                      required
                      placeholder="OWB-001-S-BLUE"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Price *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={variant.price}
                      onChange={(e) => updateVariant(index, 'price', e.target.value)}
                      required
                      placeholder="29.99"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Stock *</Label>
                    <Input
                      type="number"
                      value={variant.stock}
                      onChange={(e) => updateVariant(index, 'stock', e.target.value)}
                      required
                      placeholder="25"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Size</Label>
                    <Input
                      value={variant.size || ''}
                      onChange={(e) => updateVariant(index, 'size', e.target.value)}
                      placeholder="Small"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Color</Label>
                    <Input
                      value={variant.color || ''}
                      onChange={(e) => updateVariant(index, 'color', e.target.value)}
                      placeholder="Blue"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Material</Label>
                    <Input
                      value={variant.material || ''}
                      onChange={(e) => updateVariant(index, 'material', e.target.value)}
                      placeholder="Glass Beads"
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Product Images */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Product Images</CardTitle>
              <Button type="button" onClick={addImage} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Image
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {images.map((image, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={image}
                  onChange={(e) => updateImage(index, e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="flex-1"
                />
                {images.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeImage(index)}
                    variant="outline"
                    size="sm"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <p className="text-sm text-gray-500">
              Enter image URLs (Unsplash or Vercel Blob Storage)
            </p>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link href="/admin/products">
            <Button type="button" variant="outline" disabled={saving}>
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
