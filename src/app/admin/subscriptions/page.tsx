'use client';

import { useEffect, useState, useCallback } from'react';
import {
 DollarSign,
 Users,
 Edit,
 Save,
 X,
 Package,
 Star,
 Zap,
 Crown,
 Check,
 Loader2,
 User as UserIcon
} from'lucide-react';
import NextImage from'next/image';
import toast from'react-hot-toast';

interface SubscriptionPlan {
 id: string;
 name: string;
 tier:'BASIC' |'PREMIUM' |'COLLECTOR';
 description: string;
 priceMonthly: number;
 stripePriceId: string | null;
 braceletsPerMonth: number;
 exclusiveDiscounts: boolean;
 earlyAccess: boolean;
 limitedEditions: boolean;
 vipPerks: boolean;
 features: string[];
 badgeColor: string | null;
 isActive: boolean;
 createdAt: string;
 updatedAt: string;
 _count: {
 subscriptions: number;
 };
}

interface Subscriber {
 id: string;
 user: {
 name: string | null;
 email: string;
 image: string | null;
 };
 plan: {
 id: string;
 name: string;
 priceMonthly: number;
 };
 status:'ACTIVE' |'PAUSED' |'CANCELLED' |'PAST_DUE' |'TRIALING';
 createdAt: string;
 currentPeriodEnd: string | null;
}

interface EditingPlan {
 id: string;
 name: string;
 description: string;
 priceMonthly: string;
 braceletsPerMonth: string;
 exclusiveDiscounts: boolean;
 earlyAccess: boolean;
 limitedEditions: boolean;
 vipPerks: boolean;
 features: string;
 badgeColor: string;
 isActive: boolean;
}

interface EditingSubscriber {
 id: string;
 status: string;
 currentPeriodEnd: string;
}

const tierIcons = {
 BASIC: Package,
 PREMIUM: Star,
 COLLECTOR: Crown,
};

const tierColors = {
 BASIC:'bg-cyan-50 text-cyan-700 border-cyan-200',
 PREMIUM:'bg-teal-50 text-teal-700 border-teal-200',
 COLLECTOR:'bg-purple-50 text-purple-700 border-purple-200',
};

const statusColors = {
 ACTIVE:'bg-green-100 text-green-800',
 PAUSED:'bg-yellow-100 text-yellow-800',
 CANCELLED:'bg-red-100 text-red-800',
 PAST_DUE:'bg-orange-100 text-orange-800',
 TRIALING:'bg-blue-100 text-blue-800',
};

export default function SubscriptionsPage() {
 const [activeTab, setActiveTab] = useState<'plans' |'subscribers'>('plans');
 
 // Plans State
 const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
 const [loadingPlans, setLoadingPlans] = useState(true);
 const [editingId, setEditingId] = useState<string | null>(null);
 const [editingData, setEditingData] = useState<EditingPlan | null>(null);
 
 // Subscribers State
 const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
 const [loadingSubscribers, setLoadingSubscribers] = useState(false);
 const [editingSubscriberId, setEditingSubscriberId] = useState<string | null>(null);
 const [editingSubscriberData, setEditingSubscriberData] = useState<EditingSubscriber | null>(null);
 
 const [saving, setSaving] = useState(false);

 const fetchPlans = useCallback(async () => {
 try {
 setLoadingPlans(true);
 const response = await fetch('/api/admin/subscriptions');

 if (!response.ok) {
 throw new Error('Failed to fetch subscription plans');
 }

 const data = await response.json();
 setPlans(data);
 } catch (error) {
 console.error('Error fetching plans:', error);
 toast.error('Failed to load subscription plans');
 } finally {
 setLoadingPlans(false);
 }
 }, []);

 const fetchSubscribers = useCallback(async () => {
 try {
 setLoadingSubscribers(true);
 const response = await fetch('/api/admin/subscribers');

 if (!response.ok) {
 throw new Error('Failed to fetch subscribers');
 }

 const data = await response.json();
 setSubscribers(data.subscribers);
 } catch (error) {
 console.error('Error fetching subscribers:', error);
 toast.error('Failed to load subscribers');
 } finally {
 setLoadingSubscribers(false);
 }
 }, []);

 useEffect(() => {
 if (activeTab ==='plans') {
 fetchPlans();
 } else {
 fetchSubscribers();
 }
 }, [activeTab, fetchPlans, fetchSubscribers]);

 // Plan Editing Functions
 function startEditing(plan: SubscriptionPlan) {
 setEditingId(plan.id);
 setEditingData({
 id: plan.id,
 name: plan.name,
 description: plan.description,
 priceMonthly: plan.priceMonthly.toString(),
 braceletsPerMonth: plan.braceletsPerMonth.toString(),
 exclusiveDiscounts: plan.exclusiveDiscounts,
 earlyAccess: plan.earlyAccess,
 limitedEditions: plan.limitedEditions,
 vipPerks: plan.vipPerks,
 features: plan.features.join('\n'),
 badgeColor: plan.badgeColor ||'',
 isActive: plan.isActive,
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
 const price = parseFloat(editingData.priceMonthly);
 if (isNaN(price) || price <= 0) {
 toast.error('Please enter a valid price');
 setSaving(false);
 return;
 }

 const braceletsPerMonth = parseInt(editingData.braceletsPerMonth);
 if (isNaN(braceletsPerMonth) || braceletsPerMonth <= 0) {
 toast.error('Please enter a valid number of bracelets');
 setSaving(false);
 return;
 }

 const features = editingData.features
 .split('\n')
 .map(f => f.trim())
 .filter(f => f.length > 0);

 const response = await fetch(`/api/admin/subscriptions/${editingData.id}`, {
 method:'PATCH',
 headers: {'Content-Type':'application/json' },
 body: JSON.stringify({
 name: editingData.name.trim(),
 description: editingData.description.trim(),
 priceMonthly: price,
 braceletsPerMonth,
 exclusiveDiscounts: editingData.exclusiveDiscounts,
 earlyAccess: editingData.earlyAccess,
 limitedEditions: editingData.limitedEditions,
 vipPerks: editingData.vipPerks,
 features,
 badgeColor: editingData.badgeColor.trim() || null,
 isActive: editingData.isActive,
 }),
 });

 if (!response.ok) {
 const error = await response.json();
 throw new Error(error.error ||'Failed to update plan');
 }

 toast.success('Subscription plan updated successfully');
 setEditingId(null);
 setEditingData(null);
 fetchPlans();
 } catch (error) {
 console.error('Error saving plan:', error);
 toast.error(error instanceof Error ? error.message :'Failed to save changes');
 } finally {
 setSaving(false);
 }
 }

 // Subscriber Editing Functions
 function startEditingSubscriber(sub: Subscriber) {
 setEditingSubscriberId(sub.id);
 setEditingSubscriberData({
 id: sub.id,
 status: sub.status,
 currentPeriodEnd: sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toISOString().split('T')[0] :'',
 });
 }

 function cancelEditingSubscriber() {
 setEditingSubscriberId(null);
 setEditingSubscriberData(null);
 }

 async function saveSubscriberChanges() {
 if (!editingSubscriberData) return;

 setSaving(true);
 try {
 const response = await fetch(`/api/admin/subscribers/${editingSubscriberData.id}`, {
 method:'PATCH',
 headers: {'Content-Type':'application/json' },
 body: JSON.stringify({
 status: editingSubscriberData.status,
 currentPeriodEnd: editingSubscriberData.currentPeriodEnd,
 }),
 });

 if (!response.ok) {
 throw new Error('Failed to update subscriber');
 }

 toast.success('Subscriber updated successfully');
 setEditingSubscriberId(null);
 setEditingSubscriberData(null);
 fetchSubscribers();
 } catch (error) {
 console.error('Error saving subscriber:', error);
 toast.error('Failed to update subscriber');
 } finally {
 setSaving(false);
 }
 }

 function updateEditingData(field: keyof EditingPlan, value: string | boolean) {
 if (!editingData) return;
 setEditingData({ ...editingData, [field]: value });
 }

 if (loadingPlans && activeTab ==='plans') {
 return (
 <div className="flex items-center justify-center min-h-[400px]">
 <div className="flex items-center gap-3 text-gray-600">
 <Loader2 className="w-6 h-6 animate-spin" />
 <span>Loading subscription plans...</span>
 </div>
 </div>
 );
 }

 return (
 <div className="space-y-6">
 {/* Header */}
 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
 <div>
 <h1 className="text-3xl font-bold tracking-tight text-gray-900">Subscriptions</h1>
 <p className="text-gray-600 mt-1">
 Manage plans and subscribers
 </p>
 </div>
 
 {/* Tabs */}
 <div className="flex p-1 bg-gray-100 rounded-lg">
 <button
 onClick={() => setActiveTab('plans')}
 className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
 activeTab ==='plans'
 ?'bg-white text-gray-900 shadow-sm'
 :'text-gray-500 hover:text-gray-700'
 }`}
 >
 Plans
 </button>
 <button
 onClick={() => setActiveTab('subscribers')}
 className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
 activeTab ==='subscribers'
 ?'bg-white text-gray-900 shadow-sm'
 :'text-gray-500 hover:text-gray-700'
 }`}
 >
 Subscribers
 </button>
 </div>
 </div>

 {activeTab ==='plans' ? (
 <>
 {/* Stats Overview */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 <div className="bg-white rounded-lg border border-gray-200 p-4">
 <div className="flex items-center gap-3">
 <div className="p-2 bg-teal-50 rounded-lg">
 <Users className="w-5 h-5 text-teal-600" />
 </div>
 <div>
 <p className="text-sm text-gray-500">Total Subscribers</p>
 <p className="text-2xl font-bold text-gray-900">
 {plans.reduce((sum, p) => sum + p._count.subscriptions, 0)}
 </p>
 </div>
 </div>
 </div>
 <div className="bg-white rounded-lg border border-gray-200 p-4">
 <div className="flex items-center gap-3">
 <div className="p-2 bg-green-50 rounded-lg">
 <DollarSign className="w-5 h-5 text-green-600" />
 </div>
 <div>
 <p className="text-sm text-gray-500">Monthly Revenue</p>
 <p className="text-2xl font-bold text-gray-900">
 ${plans.reduce((sum, p) => sum + (p.priceMonthly * p._count.subscriptions), 0).toFixed(2)}
 </p>
 </div>
 </div>
 </div>
 <div className="bg-white rounded-lg border border-gray-200 p-4">
 <div className="flex items-center gap-3">
 <div className="p-2 bg-purple-50 rounded-lg">
 <Zap className="w-5 h-5 text-purple-600" />
 </div>
 <div>
 <p className="text-sm text-gray-500">Active Plans</p>
 <p className="text-2xl font-bold text-gray-900">
 {plans.filter(p => p.isActive).length} / {plans.length}
 </p>
 </div>
 </div>
 </div>
 </div>

 {/* Subscription Plans */}
 {plans.length === 0 ? (
 <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
 <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
 <p className="text-gray-500 mb-4">No subscription plans found</p>
 <p className="text-sm text-gray-400">
 Subscription plans need to be created in the database first.
 </p>
 </div>
 ) : (
 <div className="grid gap-6">
 {plans.map((plan) => {
 const TierIcon = tierIcons[plan.tier];
 const isEditing = editingId === plan.id;

 return (
 <div
 key={plan.id}
 className={`bg-white rounded-lg border-2 ${
plan.isActive ?'border-gray-200' :'border-gray-100 opacity-75'
} overflow-hidden`}
 >
 {/* Plan Header */}
 <div className={`px-6 py-4 ${tierColors[plan.tier]} border-b flex items-center justify-between`}>
 <div className="flex items-center gap-3">
 <TierIcon className="w-6 h-6" />
 <div>
 <h2 className="text-xl font-bold">{plan.name}</h2>
 <span className="text-sm opacity-75">{plan.tier} Tier</span>
 </div>
 </div>
 <div className="flex items-center gap-2">
 <span className="text-sm">
 {plan._count.subscriptions} subscriber{plan._count.subscriptions !== 1 ?'s' :''}
 </span>
 {!plan.isActive && (
 <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs font-medium">
 Inactive
 </span>
 )}
 </div>
 </div>

 {/* Plan Body */}
 <div className="p-6">
 {isEditing && editingData ? (
 /* Editing Mode */
 <div className="space-y-6">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {/* Name */}
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">
 Plan Name
 </label>
 <input
 type="text"
 value={editingData.name}
 onChange={(e) => updateEditingData('name', e.target.value)}
 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white text-gray-900"
 />
 </div>

 {/* Price */}
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">
 Monthly Price ($)
 </label>
 <input
 type="number"
 value={editingData.priceMonthly}
 onChange={(e) => updateEditingData('priceMonthly', e.target.value)}
 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white text-gray-900"
 min="0"
 step="0.01"
 />
 </div>
 </div>

 {/* Description */}
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">
 Description
 </label>
 <textarea
 value={editingData.description}
 onChange={(e) => updateEditingData('description', e.target.value)}
 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white text-gray-900"
 rows={2}
 />
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {/* Bracelets per Month */}
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">
 Bracelets per Month
 </label>
 <input
 type="number"
 value={editingData.braceletsPerMonth}
 onChange={(e) => updateEditingData('braceletsPerMonth', e.target.value)}
 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white text-gray-900"
 min="1"
 />
 </div>

 {/* Badge Color */}
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">
 Badge Color
 </label>
 <input
 type="text"
 value={editingData.badgeColor}
 onChange={(e) => updateEditingData('badgeColor', e.target.value)}
 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white text-gray-900"
 placeholder="e.g., cyan, teal, purple"
 />
 </div>
 </div>

 {/* Features */}
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">
 Features (one per line)
 </label>
 <textarea
 value={editingData.features}
 onChange={(e) => updateEditingData('features', e.target.value)}
 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono text-sm bg-white text-gray-900"
 rows={6}
 placeholder="1 handcrafted bracelet monthly&#10;Free standard shipping&#10;Conservation updates"
 />
 </div>

 {/* Perks Toggles */}
 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
 <label className="flex items-center gap-2 cursor-pointer">
 <input
 type="checkbox"
 checked={editingData.exclusiveDiscounts}
 onChange={(e) => updateEditingData('exclusiveDiscounts', e.target.checked)}
 className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 bg-white"
 />
 <span className="text-sm text-gray-700">Exclusive Discounts</span>
 </label>
 <label className="flex items-center gap-2 cursor-pointer">
 <input
 type="checkbox"
 checked={editingData.earlyAccess}
 onChange={(e) => updateEditingData('earlyAccess', e.target.checked)}
 className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 bg-white"
 />
 <span className="text-sm text-gray-700">Early Access</span>
 </label>
 <label className="flex items-center gap-2 cursor-pointer">
 <input
 type="checkbox"
 checked={editingData.limitedEditions}
 onChange={(e) => updateEditingData('limitedEditions', e.target.checked)}
 className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 bg-white"
 />
 <span className="text-sm text-gray-700">Limited Editions</span>
 </label>
 <label className="flex items-center gap-2 cursor-pointer">
 <input
 type="checkbox"
 checked={editingData.vipPerks}
 onChange={(e) => updateEditingData('vipPerks', e.target.checked)}
 className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 bg-white"
 />
 <span className="text-sm text-gray-700">VIP Perks</span>
 </label>
 </div>

 {/* Active Status */}
 <label className="flex items-center gap-2 cursor-pointer">
 <input
 type="checkbox"
 checked={editingData.isActive}
 onChange={(e) => updateEditingData('isActive', e.target.checked)}
 className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 bg-white"
 />
 <span className="text-sm font-medium text-gray-700">Plan is active</span>
 </label>

 {/* Actions */}
 <div className="flex gap-3 pt-4 border-t border-gray-200">
 <button
 onClick={saveChanges}
 disabled={saving}
 className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
 >
 {saving ? (
 <Loader2 className="w-4 h-4 animate-spin" />
 ) : (
 <Save className="w-4 h-4" />
 )}
 {saving ?'Saving...' :'Save Changes'}
 </button>
 <button
 onClick={cancelEditing}
 className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
 >
 <X className="w-4 h-4" />
 Cancel
 </button>
 </div>
 </div>
 ) : (
 /* View Mode */
 <div className="space-y-4">
 <div className="flex items-start justify-between">
 <div>
 <div className="flex items-baseline gap-2 mb-2">
 <span className="text-4xl font-bold text-gray-900">
 ${plan.priceMonthly}
 </span>
 <span className="text-gray-500">/month</span>
 </div>
 <p className="text-gray-600">{plan.description}</p>
 </div>
 <button
 onClick={() => startEditing(plan)}
 className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
 >
 <Edit className="w-4 h-4" />
 Edit Plan
 </button>
 </div>

 {/* Features List */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
 {plan.features.map((feature, idx) => (
 <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
 <Check className="w-4 h-4 text-teal-500 flex-shrink-0" />
 <span>{feature}</span>
 </div>
 ))}
 </div>

 {/* Perks Summary */}
 <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
 <span className="text-sm text-gray-500">
 {plan.braceletsPerMonth} bracelet{plan.braceletsPerMonth !== 1 ?'s' :''}/month
 </span>
 {plan.exclusiveDiscounts && (
 <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
 Discounts
 </span>
 )}
 {plan.earlyAccess && (
 <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
 Early Access
 </span>
 )}
 {plan.limitedEditions && (
 <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs">
 Limited Editions
 </span>
 )}
 {plan.vipPerks && (
 <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded text-xs">
 VIP Perks
 </span>
 )}
 </div>
 </div>
 )}
 </div>
 </div>
 );
 })}
 </div>
 )}
 </>
 ) : (
 /* Subscribers Tab */
 <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
 {loadingSubscribers ? (
 <div className="flex items-center justify-center min-h-[400px]">
 <div className="flex items-center gap-3 text-gray-600">
 <Loader2 className="w-6 h-6 animate-spin" />
 <span>Loading subscribers...</span>
 </div>
 </div>
 ) : subscribers.length === 0 ? (
 <div className="text-center py-12">
 <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
 <p className="text-gray-500">No active subscribers found</p>
 </div>
 ) : (
 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead className="bg-gray-50 border-b border-gray-200">
 <tr>
 <th className="px-6 py-4 font-medium text-gray-900">Subscriber</th>
 <th className="px-6 py-4 font-medium text-gray-900">Plan</th>
 <th className="px-6 py-4 font-medium text-gray-900">Status</th>
 <th className="px-6 py-4 font-medium text-gray-900">Billing Date</th>
 <th className="px-6 py-4 font-medium text-gray-900">Joined</th>
 <th className="px-6 py-4 font-medium text-gray-900">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-200">
 {subscribers.map((sub) => (
 <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
 <td className="px-6 py-4">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
 {sub.user.image ? (
 <NextImage src={sub.user.image ||''} alt="" width={40} height={40} className="w-full h-full object-cover" />
 ) : (
 <UserIcon className="w-5 h-5 text-gray-500" />
 )}
 </div>
 <div>
 <p className="font-medium text-gray-900">
 {sub.user.name ||'Unknown User'}
 </p>
 <p className="text-sm text-gray-500">
 {sub.user.email}
 </p>
 </div>
 </div>
 </td>
 <td className="px-6 py-4">
 {editingSubscriberId === sub.id ? (
 <div className="text-sm text-gray-500">Plan change not yet implemented</div>
 ) : (
 <div>
 <p className="font-medium text-gray-900">{sub.plan.name}</p>
 <p className="text-sm text-gray-500">
 ${sub.plan.priceMonthly.toFixed(2)}/mo
 </p>
 </div>
 )}
 </td>
 <td className="px-6 py-4">
 {editingSubscriberId === sub.id ? (
 <select
 value={editingSubscriberData?.status}
 onChange={(e) => setEditingSubscriberData(prev => prev ? {...prev, status: e.target.value} : null)}
 className="px-2 py-1 border border-gray-300 bg-white text-gray-900 rounded text-sm"
 >
 <option value="ACTIVE">Active</option>
 <option value="PAUSED">Paused</option>
 <option value="CANCELLED">Cancelled</option>
 <option value="PAST_DUE">Past Due</option>
 </select>
 ) : (
 <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[sub.status]}`}>
 {sub.status.replace('_','')}
 </span>
 )}
 </td>
 <td className="px-6 py-4 text-sm text-gray-600">
 {editingSubscriberId === sub.id ? (
 <input 
 type="date"
 value={editingSubscriberData?.currentPeriodEnd}
 onChange={(e) => setEditingSubscriberData(prev => prev ? {...prev, currentPeriodEnd: e.target.value} : null)}
 className="px-2 py-1 border border-gray-300 bg-white text-gray-900 rounded text-sm"
 />
 ) : (
 sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toLocaleDateString() :'N/A'
 )}
 </td>
 <td className="px-6 py-4 text-sm text-gray-600">
 {new Date(sub.createdAt).toLocaleDateString()}
 </td>
 <td className="px-6 py-4">
 {editingSubscriberId === sub.id ? (
 <div className="flex items-center gap-2">
 <button
 onClick={saveSubscriberChanges}
 disabled={saving}
 className="p-1.5 bg-green-100 text-green-600 rounded hover:bg-green-200"
 >
 <Check className="w-4 h-4" />
 </button>
 <button
 onClick={cancelEditingSubscriber}
 className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200"
 >
 <X className="w-4 h-4" />
 </button>
 </div>
 ) : (
 <button
 onClick={() => startEditingSubscriber(sub)}
 className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm font-medium"
 >
 <Edit className="w-3.5 h-3.5" />
 Edit
 </button>
 )}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 )}
 </div>
 )}

 {/* Help Text */}
 <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
 <h3 className="font-medium text-blue-900 mb-2">Managing Subscription Plans</h3>
 <ul className="text-sm text-blue-800 space-y-1">
 <li>Click &quot;Edit Plan&quot; to modify pricing, features, and settings</li>
 <li>Changes take effect immediately for new subscribers</li>
 <li>Existing subscribers will keep their current rate until renewal</li>
 <li>Deactivate plans to hide them from new signups without affecting current subscribers</li>
 </ul>
 </div>
 </div>
 );
}
