'use client';

import { useEffect, useState, useCallback } from'react';
import {
 Ruler,
 Plus,
 Edit,
 Save,
 X,
 Trash2,
 Download,
 Loader2,
 GripVertical,
 Check
} from'lucide-react';
import toast from'react-hot-toast';

interface BraceletSize {
 id: string;
 name: string;
 label: string;
 inches: string;
 numericSize: number | null;
 description: string | null;
 displayOrder: number;
 isActive: boolean;
 createdAt: string;
 updatedAt: string;
}

interface EditingSize {
 id: string;
 name: string;
 label: string;
 inches: string;
 numericSize: string;
 description: string;
 displayOrder: string;
 isActive: boolean;
}

export default function BraceletSizesPage() {
 const [sizes, setSizes] = useState<BraceletSize[]>([]);
 const [loading, setLoading] = useState(true);
 const [seeding, setSeeding] = useState(false);
 const [editingId, setEditingId] = useState<string | null>(null);
 const [editingData, setEditingData] = useState<EditingSize | null>(null);
 const [saving, setSaving] = useState(false);
 const [showAddForm, setShowAddForm] = useState(false);
 const [newSize, setNewSize] = useState({
 name:'',
 label:'',
 inches:'',
 numericSize:'',
 description:'',
 displayOrder:'0',
 isActive: true,
 });

 const fetchSizes = useCallback(async () => {
 try {
 setLoading(true);
 const response = await fetch('/api/admin/bracelet-sizes');

 if (!response.ok) {
 throw new Error('Failed to fetch bracelet sizes');
 }

 const data = await response.json();
 setSizes(data);
 } catch (error) {
 console.error('Error fetching sizes:', error);
 toast.error('Failed to load bracelet sizes');
 } finally {
 setLoading(false);
 }
 }, []);

 useEffect(() => {
 fetchSizes();
 }, [fetchSizes]);

 async function seedDefaultSizes() {
 setSeeding(true);
 try {
 const response = await fetch('/api/admin/bracelet-sizes/seed', {
 method:'POST',
 });

 if (!response.ok) {
 throw new Error('Failed to seed sizes');
 }

 toast.success('Default sizes created successfully');
 fetchSizes();
 } catch (error) {
 console.error('Error seeding sizes:', error);
 toast.error('Failed to create default sizes');
 } finally {
 setSeeding(false);
 }
 }

 function startEditing(size: BraceletSize) {
 setEditingId(size.id);
 setEditingData({
 id: size.id,
 name: size.name,
 label: size.label,
 inches: size.inches,
 numericSize: size.numericSize?.toString() ||'',
 description: size.description ||'',
 displayOrder: size.displayOrder.toString(),
 isActive: size.isActive,
 });
 }

 function cancelEditing() {
 setEditingId(null);
 setEditingData(null);
 }

 async function saveChanges() {
 if (!editingData) return;

 setSaving(true);
 try {
 const response = await fetch(`/api/admin/bracelet-sizes/${editingData.id}`, {
 method:'PATCH',
 headers: {'Content-Type':'application/json' },
 body: JSON.stringify({
 name: editingData.name.trim().toUpperCase(),
 label: editingData.label.trim(),
 inches: editingData.inches.trim(),
 numericSize: editingData.numericSize ? parseInt(editingData.numericSize) : null,
 description: editingData.description.trim() || null,
 displayOrder: parseInt(editingData.displayOrder) || 0,
 isActive: editingData.isActive,
 }),
 });

 if (!response.ok) {
 const error = await response.json();
 throw new Error(error.error ||'Failed to update size');
 }

 toast.success('Size updated successfully');
 setEditingId(null);
 setEditingData(null);
 fetchSizes();
 } catch (error) {
 console.error('Error saving size:', error);
 toast.error(error instanceof Error ? error.message :'Failed to save changes');
 } finally {
 setSaving(false);
 }
 }

 async function deleteSize(id: string) {
 if (!confirm('Are you sure you want to delete this size?')) return;

 try {
 const response = await fetch(`/api/admin/bracelet-sizes/${id}`, {
 method:'DELETE',
 });

 if (!response.ok) {
 throw new Error('Failed to delete size');
 }

 toast.success('Size deleted successfully');
 fetchSizes();
 } catch (error) {
 console.error('Error deleting size:', error);
 toast.error('Failed to delete size');
 }
 }

 async function addNewSize() {
 if (!newSize.name.trim() || !newSize.label.trim() || !newSize.inches.trim()) {
 toast.error('Name, label, and inches are required');
 return;
 }

 setSaving(true);
 try {
 const response = await fetch('/api/admin/bracelet-sizes', {
 method:'POST',
 headers: {'Content-Type':'application/json' },
 body: JSON.stringify({
 name: newSize.name.trim().toUpperCase(),
 label: newSize.label.trim(),
 inches: newSize.inches.trim(),
 numericSize: newSize.numericSize ? parseInt(newSize.numericSize) : null,
 description: newSize.description.trim() || null,
 displayOrder: parseInt(newSize.displayOrder) || 0,
 isActive: newSize.isActive,
 }),
 });

 if (!response.ok) {
 const error = await response.json();
 throw new Error(error.error ||'Failed to create size');
 }

 toast.success('Size created successfully');
 setShowAddForm(false);
 setNewSize({
 name:'',
 label:'',
 inches:'',
 numericSize:'',
 description:'',
 displayOrder:'0',
 isActive: true,
 });
 fetchSizes();
 } catch (error) {
 console.error('Error creating size:', error);
 toast.error(error instanceof Error ? error.message :'Failed to create size');
 } finally {
 setSaving(false);
 }
 }

 function updateEditingData(field: keyof EditingSize, value: string | boolean) {
 if (!editingData) return;
 setEditingData({ ...editingData, [field]: value });
 }

 if (loading) {
 return (
 <div className="flex items-center justify-center min-h-[400px]">
 <div className="flex items-center gap-3 text-gray-600">
 <Loader2 className="w-6 h-6 animate-spin" />
 <span>Loading bracelet sizes...</span>
 </div>
 </div>
 );
 }

 return (
 <div className="space-y-6">
 {/* Header */}
 <div className="flex items-center justify-between">
 <div>
 <h1 className="text-3xl font-bold tracking-tight">Bracelet Sizes</h1>
 <p className="text-gray-600 mt-1">
 Configure size options for your bracelets
 </p>
 </div>
 <div className="flex gap-3">
 {sizes.length === 0 && (
 <button
 onClick={seedDefaultSizes}
 disabled={seeding}
 className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-300 transition-colors"
 >
 {seeding ? (
 <Loader2 className="w-4 h-4 animate-spin" />
 ) : (
 <Download className="w-4 h-4" />
 )}
 {seeding ?'Creating...' :'Load Default Sizes'}
 </button>
 )}
 <button
 onClick={() => setShowAddForm(true)}
 className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
 >
 <Plus className="w-4 h-4" />
 Add Size
 </button>
 </div>
 </div>

 {/* Size Guide Info */}
 <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
 <h3 className="font-medium text-blue-900 mb-2">Size Configuration</h3>
 <p className="text-sm text-blue-800">
 Configure your bracelet sizes here. The &quot;Numeric Size&quot; field represents the actual size number
 (e.g., Size 8 = 8 inches). Customers will see the label and inch measurement when selecting sizes.
 </p>
 </div>

 {/* Add New Size Form */}
 {showAddForm && (
 <div className="bg-white rounded-lg border-2 border-blue-200 p-6">
 <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Size</h3>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">
 Size Name *
 </label>
 <input
 type="text"
 value={newSize.name}
 onChange={(e) => setNewSize({ ...newSize, name: e.target.value })}
 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
 placeholder="e.g., XS, S, M, L, XL"
 />
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">
 Display Label *
 </label>
 <input
 type="text"
 value={newSize.label}
 onChange={(e) => setNewSize({ ...newSize, label: e.target.value })}
 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
 placeholder="e.g., Large (Size 8)"
 />
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">
 Inches *
 </label>
 <input
 type="text"
 value={newSize.inches}
 onChange={(e) => setNewSize({ ...newSize, inches: e.target.value })}
 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
 placeholder="e.g., 8, 7-7.5"
 />
 </div>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">
 Numeric Size
 </label>
 <input
 type="number"
 value={newSize.numericSize}
 onChange={(e) => setNewSize({ ...newSize, numericSize: e.target.value })}
 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
 placeholder="e.g., 8"
 />
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">
 Display Order
 </label>
 <input
 type="number"
 value={newSize.displayOrder}
 onChange={(e) => setNewSize({ ...newSize, displayOrder: e.target.value })}
 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
 />
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">
 Description
 </label>
 <input
 type="text"
 value={newSize.description}
 onChange={(e) => setNewSize({ ...newSize, description: e.target.value })}
 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
 placeholder="e.g., Best for larger wrists"
 />
 </div>
 </div>
 <div className="flex items-center gap-4">
 <label className="flex items-center gap-2 cursor-pointer">
 <input
 type="checkbox"
 checked={newSize.isActive}
 onChange={(e) => setNewSize({ ...newSize, isActive: e.target.checked })}
 className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
 />
 <span className="text-sm text-gray-700">Active</span>
 </label>
 <div className="flex-1" />
 <button
 onClick={() => setShowAddForm(false)}
 className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
 >
 Cancel
 </button>
 <button
 onClick={addNewSize}
 disabled={saving}
 className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
 >
 {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
 {saving ?'Adding...' :'Add Size'}
 </button>
 </div>
 </div>
 )}

 {/* Sizes List */}
 {sizes.length === 0 && !showAddForm ? (
 <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
 <Ruler className="w-12 h-12 text-gray-400 mx-auto mb-4" />
 <p className="text-gray-500 mb-4">No bracelet sizes configured yet</p>
 <button
 onClick={seedDefaultSizes}
 disabled={seeding}
 className="text-teal-600 hover:text-teal-700 font-medium"
 >
 {seeding ?'Creating...' :'Click to load default sizes (S, M, L, XL)'}
 </button>
 </div>
 ) : (
 <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
 <table className="w-full">
 <thead className="bg-gray-50 border-b">
 <tr>
 <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Order</th>
 <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Size</th>
 <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Label</th>
 <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Inches</th>
 <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Numeric</th>
 <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Description</th>
 <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Status</th>
 <th className="text-right px-6 py-3 text-sm font-semibold text-gray-900">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-200">
 {sizes.map((size) => {
 const isEditing = editingId === size.id;

 return (
 <tr key={size.id} className="hover:bg-gray-50">
 {isEditing && editingData ? (
 <>
 <td className="px-6 py-4">
 <input
 type="number"
 value={editingData.displayOrder}
 onChange={(e) => updateEditingData('displayOrder', e.target.value)}
 className="w-16 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 bg-white text-gray-900"
 />
 </td>
 <td className="px-6 py-4">
 <input
 type="text"
 value={editingData.name}
 onChange={(e) => updateEditingData('name', e.target.value)}
 className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 uppercase bg-white text-gray-900"
 />
 </td>
 <td className="px-6 py-4">
 <input
 type="text"
 value={editingData.label}
 onChange={(e) => updateEditingData('label', e.target.value)}
 className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 bg-white text-gray-900"
 />
 </td>
 <td className="px-6 py-4">
 <input
 type="text"
 value={editingData.inches}
 onChange={(e) => updateEditingData('inches', e.target.value)}
 className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 bg-white text-gray-900"
 />
 </td>
 <td className="px-6 py-4">
 <input
 type="number"
 value={editingData.numericSize}
 onChange={(e) => updateEditingData('numericSize', e.target.value)}
 className="w-16 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 bg-white text-gray-900"
 />
 </td>
 <td className="px-6 py-4">
 <input
 type="text"
 value={editingData.description}
 onChange={(e) => updateEditingData('description', e.target.value)}
 className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 bg-white text-gray-900"
 />
 </td>
 <td className="px-6 py-4">
 <label className="flex items-center gap-2 cursor-pointer">
 <input
 type="checkbox"
 checked={editingData.isActive}
 onChange={(e) => updateEditingData('isActive', e.target.checked)}
 className="w-4 h-4 text-teal-600 border-gray-300 rounded"
 />
 <span className="text-sm text-gray-900">Active</span>
 </label>
 </td>
 <td className="px-6 py-4">
 <div className="flex items-center justify-end gap-2">
 <button
 onClick={saveChanges}
 disabled={saving}
 className="p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-300"
 >
 {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
 </button>
 <button
 onClick={cancelEditing}
 className="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
 >
 <X className="w-4 h-4" />
 </button>
 </div>
 </td>
 </>
 ) : (
 <>
 <td className="px-6 py-4 text-gray-500">
 <div className="flex items-center gap-2">
 <GripVertical className="w-4 h-4 text-gray-400" />
 {size.displayOrder}
 </div>
 </td>
 <td className="px-6 py-4">
 <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full font-bold">
 {size.name}
 </span>
 </td>
 <td className="px-6 py-4 font-medium text-gray-900">{size.label}</td>
 <td className="px-6 py-4 text-gray-600">{size.inches}&quot;</td>
 <td className="px-6 py-4 text-gray-600">
 {size.numericSize ? `Size ${size.numericSize}` :'-'}
 </td>
 <td className="px-6 py-4 text-gray-500 text-sm">{size.description ||'-'}</td>
 <td className="px-6 py-4">
 {size.isActive ? (
 <span className="flex items-center gap-1 text-green-600 text-sm">
 <Check className="w-4 h-4" />
 Active
 </span>
 ) : (
 <span className="text-gray-400 text-sm">Inactive</span>
 )}
 </td>
 <td className="px-6 py-4">
 <div className="flex items-center justify-end gap-2">
 <button
 onClick={() => startEditing(size)}
 className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
 title="Edit"
 >
 <Edit className="w-4 h-4 text-gray-600" />
 </button>
 <button
 onClick={() => deleteSize(size.id)}
 className="p-2 hover:bg-red-50 rounded-lg transition-colors"
 title="Delete"
 >
 <Trash2 className="w-4 h-4 text-red-600" />
 </button>
 </div>
 </td>
 </>
 )}
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 )}

 {/* Help Text */}
 <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
 <h3 className="font-medium text-gray-900 mb-2">Size Guide Reference</h3>
 <div className="text-sm text-gray-600 space-y-1">
 <p><strong>S (Small):</strong> 6-6.5 inches - For smaller wrists</p>
 <p><strong>M (Medium):</strong> 7-7.5 inches - Most common size</p>
 <p><strong>L (Large/Size 8):</strong> 8 inches - For larger wrists</p>
 <p><strong>XL (Extra Large/Size 9):</strong> 9 inches - For extra large wrists</p>
 </div>
 </div>
 </div>
 );
}
