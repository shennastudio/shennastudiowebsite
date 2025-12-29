'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Calendar as CalendarIcon,
  Plus,
  Edit,
  Trash2,
  X,
  Clock,
  MapPin,
  Users,
  Bell,
  Repeat,
  Filter,
  List,
  Grid3x3,
  Flag,
  Tag,
  BookOpen,
  DollarSign,
  CheckSquare,
  Link as LinkIcon,
  ChevronDown,
  ChevronUp,
  Target,
  TrendingUp,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ChecklistItem {
  text: string;
  done: boolean;
}

interface CalendarEvent {
  id: string;
  title: string;
  description?: string | null;
  date: string;
  time?: string | null;
  endTime?: string | null;
  allDay: boolean;
  color: string;
  category: string;
  location?: string | null;
  attendees: string[];
  recurring: boolean;
  recurringPattern?: string | null;
  recurringEnd?: string | null;
  reminder: boolean;
  reminderTime?: number | null;
  status: string;
  // Business journal fields
  priority: string;
  tags: string[];
  journalEntry?: string | null;
  projectedRevenue?: number | null;
  actualRevenue?: number | null;
  completionPercent: number;
  checklist?: ChecklistItem[] | null;
  links: string[];
}

const eventColors = [
  { name: 'Ocean Blue', value: 'from-blue-500 to-cyan-500' },
  { name: 'Teal Green', value: 'from-teal-500 to-emerald-500' },
  { name: 'Coral Pink', value: 'from-pink-500 to-rose-500' },
  { name: 'Sunset Orange', value: 'from-orange-500 to-amber-500' },
  { name: 'Deep Purple', value: 'from-purple-500 to-violet-500' },
  { name: 'Sea Green', value: 'from-emerald-500 to-green-500' },
  { name: 'Gold', value: 'from-yellow-500 to-amber-500' },
  { name: 'Slate', value: 'from-slate-500 to-gray-600' },
];

const categories = [
  { value: 'general', label: 'General', icon: '📋' },
  { value: 'meeting', label: 'Meeting', icon: '🤝' },
  { value: 'deadline', label: 'Deadline', icon: '⏰' },
  { value: 'personal', label: 'Personal', icon: '👤' },
  { value: 'marketing', label: 'Marketing', icon: '📢' },
  { value: 'product-launch', label: 'Product Launch', icon: '🚀' },
  { value: 'goal', label: 'Business Goal', icon: '🎯' },
  { value: 'task', label: 'Task', icon: '✅' },
  { value: 'note', label: 'Journal Note', icon: '📝' },
  { value: 'sales', label: 'Sales', icon: '💰' },
  { value: 'inventory', label: 'Inventory', icon: '📦' },
];

const priorities = [
  { value: 'low', label: 'Low', color: 'bg-slate-100 text-slate-700', icon: '🔵' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-700', icon: '🟡' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-700', icon: '🟠' },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-700', icon: '🔴' },
];

const suggestedTags = [
  'sales', 'inventory', 'client', 'supplier', 'shipping',
  'marketing', 'social-media', 'design', 'finance', 'legal',
  'follow-up', 'review', 'planning', 'urgent', 'ideas'
];

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'month' | 'list' | 'journal'>('month');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    business: false,
    checklist: false,
    recurring: false,
  });
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newLink, setNewLink] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    endTime: '',
    allDay: false,
    color: eventColors[0].value,
    category: 'general',
    location: '',
    attendees: [] as string[],
    recurring: false,
    recurringPattern: 'weekly' as 'daily' | 'weekly' | 'monthly' | 'yearly',
    recurringEnd: '',
    reminder: false,
    reminderTime: 30,
    status: 'scheduled' as 'scheduled' | 'completed' | 'cancelled' | 'in_progress',
    // Business journal fields
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    tags: [] as string[],
    journalEntry: '',
    projectedRevenue: '' as string | number,
    actualRevenue: '' as string | number,
    completionPercent: 0,
    checklist: [] as ChecklistItem[],
    links: [] as string[],
  });

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/calendar');
      if (!response.ok) throw new Error('Failed to load events');

      const data = await response.json();
      setEvents(data.events.map((e: CalendarEvent) => ({
        ...e,
        date: new Date(e.date).toISOString().split('T')[0],
        checklist: e.checklist || [],
        tags: e.tags || [],
        links: e.links || [],
      })));
    } catch (error) {
      console.error('Load events error:', error);
      toast.error('Failed to load calendar events');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const method = editingEvent ? 'PATCH' : 'POST';
      const url = editingEvent
        ? `/api/admin/calendar/${editingEvent.id}`
        : '/api/admin/calendar';

      const payload = {
        ...formData,
        time: formData.allDay ? null : (formData.time || null),
        endTime: formData.allDay ? null : (formData.endTime || null),
        attendees: formData.attendees.filter(a => a.trim()),
        recurringPattern: formData.recurring ? formData.recurringPattern : null,
        recurringEnd: formData.recurring && formData.recurringEnd ? formData.recurringEnd : null,
        reminderTime: formData.reminder ? formData.reminderTime : null,
        projectedRevenue: formData.projectedRevenue ? Number(formData.projectedRevenue) : null,
        actualRevenue: formData.actualRevenue ? Number(formData.actualRevenue) : null,
        checklist: formData.checklist.length > 0 ? formData.checklist : null,
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save event');
      }

      toast.success(editingEvent ? 'Event updated!' : 'Event created!');
      resetForm();
      loadEvents();
    } catch (error) {
      console.error('Save event error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save event');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const response = await fetch(`/api/admin/calendar/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete event');

      toast.success('Event deleted');
      loadEvents();
    } catch (error) {
      console.error('Delete event error:', error);
      toast.error('Failed to delete event');
    }
  };

  const handleEdit = (event: CalendarEvent) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      date: event.date,
      time: event.time || '',
      endTime: event.endTime || '',
      allDay: event.allDay,
      color: event.color,
      category: event.category,
      location: event.location || '',
      attendees: event.attendees || [],
      recurring: event.recurring,
      recurringPattern: (event.recurringPattern as 'daily' | 'weekly' | 'monthly' | 'yearly') || 'weekly',
      recurringEnd: event.recurringEnd || '',
      reminder: event.reminder,
      reminderTime: event.reminderTime || 30,
      status: event.status as 'scheduled' | 'completed' | 'cancelled' | 'in_progress',
      priority: (event.priority as 'low' | 'medium' | 'high' | 'urgent') || 'medium',
      tags: event.tags || [],
      journalEntry: event.journalEntry || '',
      projectedRevenue: event.projectedRevenue || '',
      actualRevenue: event.actualRevenue || '',
      completionPercent: event.completionPercent || 0,
      checklist: event.checklist || [],
      links: event.links || [],
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      endTime: '',
      allDay: false,
      color: eventColors[0].value,
      category: 'general',
      location: '',
      attendees: [],
      recurring: false,
      recurringPattern: 'weekly',
      recurringEnd: '',
      reminder: false,
      reminderTime: 30,
      status: 'scheduled',
      priority: 'medium',
      tags: [],
      journalEntry: '',
      projectedRevenue: '',
      actualRevenue: '',
      completionPercent: 0,
      checklist: [],
      links: [],
    });
    setEditingEvent(null);
    setShowModal(false);
    setExpandedSections({ basic: true, business: false, checklist: false, recurring: false });
  };

  const addChecklistItem = () => {
    if (!newChecklistItem.trim()) return;
    setFormData({
      ...formData,
      checklist: [...formData.checklist, { text: newChecklistItem.trim(), done: false }],
    });
    setNewChecklistItem('');
  };

  const toggleChecklistItem = (index: number) => {
    const updated = [...formData.checklist];
    updated[index].done = !updated[index].done;
    // Update completion percent based on checklist
    const doneCount = updated.filter(item => item.done).length;
    const percent = updated.length > 0 ? Math.round((doneCount / updated.length) * 100) : 0;
    setFormData({ ...formData, checklist: updated, completionPercent: percent });
  };

  const removeChecklistItem = (index: number) => {
    const updated = formData.checklist.filter((_, i) => i !== index);
    const doneCount = updated.filter(item => item.done).length;
    const percent = updated.length > 0 ? Math.round((doneCount / updated.length) * 100) : 0;
    setFormData({ ...formData, checklist: updated, completionPercent: percent });
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (!trimmedTag || formData.tags.includes(trimmedTag)) return;
    setFormData({ ...formData, tags: [...formData.tags, trimmedTag] });
    setNewTag('');
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  const addLink = () => {
    if (!newLink.trim()) return;
    setFormData({ ...formData, links: [...formData.links, newLink.trim()] });
    setNewLink('');
  };

  const removeLink = (index: number) => {
    setFormData({ ...formData, links: formData.links.filter((_, i) => i !== index) });
  };

  const getEventsForDate = (date: string) => {
    return events.filter(event => {
      if (filterCategory !== 'all' && event.category !== filterCategory) return false;
      if (filterPriority !== 'all' && event.priority !== filterPriority) return false;
      return event.date === date;
    });
  };

  const generateCalendar = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const formatDate = (day: number) => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${month}-${dayStr}`;
  };

  const filteredEvents = events.filter(e => {
    if (filterCategory !== 'all' && e.category !== filterCategory) return false;
    if (filterPriority !== 'all' && e.priority !== filterPriority) return false;
    return true;
  });

  const getPriorityColor = (priority: string) => {
    const p = priorities.find(pr => pr.value === priority);
    return p?.color || 'bg-slate-100 text-slate-700';
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({ ...expandedSections, [section]: !expandedSections[section] });
  };

  // Stats calculations
  const totalProjectedRevenue = filteredEvents.reduce((sum, e) => sum + (e.projectedRevenue || 0), 0);
  const totalActualRevenue = filteredEvents.reduce((sum, e) => sum + (e.actualRevenue || 0), 0);
  const completedTasks = filteredEvents.filter(e => e.status === 'completed').length;
  const pendingTasks = filteredEvents.filter(e => e.status === 'scheduled' || e.status === 'in_progress').length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-cyan-900 to-teal-900 bg-clip-text text-transparent">
            Business Calendar & Journal
          </h1>
          <p className="text-slate-600 text-lg mt-1">Track events, goals, tasks, and business insights</p>
        </div>
        <div className="flex gap-3">
          <div className="flex gap-2 border border-slate-200 rounded-lg p-1">
            <Button
              variant={viewMode === 'month' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('month')}
              className={viewMode === 'month' ? 'bg-gradient-to-r from-cyan-600 to-teal-600' : ''}
            >
              <Grid3x3 className="w-4 h-4 mr-2" />
              Month
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-gradient-to-r from-cyan-600 to-teal-600' : ''}
            >
              <List className="w-4 h-4 mr-2" />
              List
            </Button>
            <Button
              variant={viewMode === 'journal' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('journal')}
              className={viewMode === 'journal' ? 'bg-gradient-to-r from-cyan-600 to-teal-600' : ''}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Journal
            </Button>
          </div>
          <Button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Entry
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-slate-200/60 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Pending Tasks</p>
                <p className="text-xl font-bold text-slate-900">{pendingTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200/60 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckSquare className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Completed</p>
                <p className="text-xl font-bold text-slate-900">{completedTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200/60 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Projected Revenue</p>
                <p className="text-xl font-bold text-slate-900">${totalProjectedRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200/60 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Actual Revenue</p>
                <p className="text-xl font-bold text-slate-900">${totalActualRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-slate-200/60 shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <Filter className="w-4 h-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">Category:</span>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3">
              <Flag className="w-4 h-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">Priority:</span>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm"
              >
                <option value="all">All Priorities</option>
                {priorities.map(p => (
                  <option key={p.value} value={p.value}>{p.icon} {p.label}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Month View */}
      {viewMode === 'month' && (
        <Card className="border-slate-200/60 shadow-xl">
          <CardHeader className="border-b border-slate-200/60 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-cyan-600" />
                {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDate(new Date())}
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
                  <p className="text-slate-600">Loading calendar...</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center font-semibold text-slate-600 py-2">
                    {day}
                  </div>
                ))}
                {generateCalendar().map((day, index) => {
                  const dateStr = day ? formatDate(day) : '';
                  const dayEvents = day ? getEventsForDate(dateStr) : [];
                  const isToday = day && dateStr === new Date().toISOString().split('T')[0];

                  return (
                    <div
                      key={index}
                      className={`min-h-[120px] p-2 border border-slate-200 rounded-lg ${
                        day ? 'bg-white hover:bg-slate-50 cursor-pointer transition-colors' : 'bg-slate-50'
                      } ${isToday ? 'ring-2 ring-cyan-500' : ''}`}
                    >
                      {day && (
                        <>
                          <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-cyan-600' : 'text-slate-700'}`}>
                            {day}
                          </div>
                          <div className="space-y-1">
                            {dayEvents.slice(0, 3).map(event => (
                              <div
                                key={event.id}
                                onClick={() => handleEdit(event)}
                                className={`text-[10px] px-2 py-1 rounded bg-gradient-to-r ${event.color} text-white font-medium truncate hover:scale-105 transition-transform cursor-pointer flex items-center gap-1`}
                                title={event.title}
                              >
                                {event.priority === 'urgent' && <span>!</span>}
                                {event.allDay ? '' : `${event.time} `}
                                {event.title}
                              </div>
                            ))}
                            {dayEvents.length > 3 && (
                              <div className="text-[10px] text-slate-500 px-2">
                                +{dayEvents.length - 3} more
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <Card className="border-slate-200/60 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/60">
            <CardTitle>All Events & Tasks</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p>No events found. Click &quot;Add Entry&quot; to get started!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredEvents
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map(event => (
                    <div
                      key={event.id}
                      className="flex items-start gap-4 p-4 bg-white border border-slate-200/60 rounded-xl hover:shadow-lg transition-shadow"
                    >
                      <div className={`w-1 h-full min-h-[80px] rounded-full bg-gradient-to-b ${event.color}`}></div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-slate-900 text-lg">{event.title}</h3>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(event.priority)}`}>
                                {event.priority}
                              </span>
                            </div>
                            {event.description && (
                              <p className="text-sm text-slate-600 mt-1">{event.description}</p>
                            )}
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            event.status === 'completed' ? 'bg-green-100 text-green-700' :
                            event.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            event.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {event.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3" />
                            {new Date(event.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {event.allDay ? 'All Day' : `${event.time || 'No time'}${event.endTime ? ` - ${event.endTime}` : ''}`}
                          </span>
                          {event.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {event.location}
                            </span>
                          )}
                          {event.completionPercent > 0 && (
                            <span className="flex items-center gap-1 text-cyan-600">
                              <Target className="w-3 h-3" />
                              {event.completionPercent}% complete
                            </span>
                          )}
                          {(event.projectedRevenue || event.actualRevenue) && (
                            <span className="flex items-center gap-1 text-emerald-600">
                              <DollarSign className="w-3 h-3" />
                              ${event.actualRevenue || 0} / ${event.projectedRevenue || 0}
                            </span>
                          )}
                        </div>
                        {event.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {event.tags.map(tag => (
                              <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(event)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(event.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Journal View */}
      {viewMode === 'journal' && (
        <Card className="border-slate-200/60 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/60">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-600" />
              Business Journal Entries
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
              </div>
            ) : filteredEvents.filter(e => e.journalEntry || e.category === 'note').length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p>No journal entries yet. Add entries with notes to see them here!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredEvents
                  .filter(e => e.journalEntry || e.category === 'note')
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map(event => (
                    <div
                      key={event.id}
                      className="p-6 bg-white border border-slate-200/60 rounded-xl hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-xl text-slate-900">{event.title}</h3>
                          <p className="text-sm text-slate-500 mt-1">
                            {new Date(event.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(event)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(event.id)} className="text-red-600 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      {event.journalEntry && (
                        <div className="prose prose-slate max-w-none mb-4">
                          <p className="text-slate-700 whitespace-pre-wrap">{event.journalEntry}</p>
                        </div>
                      )}
                      {event.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {event.tags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-cyan-100 text-cyan-700 text-xs rounded-full">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {(event.projectedRevenue || event.actualRevenue) && (
                        <div className="flex gap-4 p-3 bg-slate-50 rounded-lg">
                          <div>
                            <p className="text-xs text-slate-500">Projected</p>
                            <p className="font-semibold text-slate-900">${event.projectedRevenue?.toLocaleString() || 0}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Actual</p>
                            <p className="font-semibold text-emerald-600">${event.actualRevenue?.toLocaleString() || 0}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl my-4">
            <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white sticky top-0 z-10 shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{editingEvent ? 'Edit Entry' : 'Add New Entry'}</CardTitle>
                <Button variant="ghost" size="sm" onClick={resetForm}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Basic Section */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleSection('basic')}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <span className="font-semibold text-slate-700 flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5" />
                      Basic Information
                    </span>
                    {expandedSections.basic ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  {expandedSections.basic && (
                    <div className="p-4 space-y-4">
                      {/* Title */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Title *</label>
                        <input
                          type="text"
                          required
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                          placeholder="Enter title"
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                          rows={2}
                          placeholder="Brief description (optional)"
                        />
                      </div>

                      {/* Date, Time, All Day */}
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1">Date *</label>
                          <input
                            type="date"
                            required
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1">Start Time</label>
                          <input
                            type="time"
                            disabled={formData.allDay}
                            value={formData.time}
                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-slate-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1">End Time</label>
                          <input
                            type="time"
                            disabled={formData.allDay}
                            value={formData.endTime}
                            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-slate-100"
                          />
                        </div>
                        <div className="flex items-end pb-1">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.allDay}
                              onChange={(e) => setFormData({ ...formData, allDay: e.target.checked })}
                              className="w-5 h-5 text-cyan-600 border-slate-300 rounded focus:ring-cyan-500"
                            />
                            <span className="text-sm font-medium text-slate-700">All day</span>
                          </label>
                        </div>
                      </div>

                      {/* Category, Priority, Status */}
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
                          <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                          >
                            {categories.map(cat => (
                              <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1">Priority</label>
                          <select
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' | 'urgent' })}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                          >
                            {priorities.map(p => (
                              <option key={p.value} value={p.value}>{p.icon} {p.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                          <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'scheduled' | 'completed' | 'cancelled' | 'in_progress' })}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                          >
                            <option value="scheduled">Scheduled</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      {/* Color Theme */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Color</label>
                        <div className="flex gap-2">
                          {eventColors.map(color => (
                            <button
                              key={color.value}
                              type="button"
                              onClick={() => setFormData({ ...formData, color: color.value })}
                              className={`h-8 w-8 rounded-lg bg-gradient-to-r ${color.value} ${
                                formData.color === color.value ? 'ring-2 ring-slate-400 scale-110' : ''
                              } transition-all hover:scale-105`}
                              title={color.name}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Location */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                          <MapPin className="w-4 h-4 inline mr-1" />
                          Location
                        </label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                          placeholder="Event location (optional)"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Business Journal Section */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleSection('business')}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <span className="font-semibold text-slate-700 flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Business Journal & Revenue
                    </span>
                    {expandedSections.business ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  {expandedSections.business && (
                    <div className="p-4 space-y-4">
                      {/* Journal Entry */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Journal Notes</label>
                        <textarea
                          value={formData.journalEntry}
                          onChange={(e) => setFormData({ ...formData, journalEntry: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                          rows={4}
                          placeholder="Write detailed notes, reflections, or insights..."
                        />
                      </div>

                      {/* Revenue Tracking */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1">
                            <TrendingUp className="w-4 h-4 inline mr-1" />
                            Projected Revenue ($)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.projectedRevenue}
                            onChange={(e) => setFormData({ ...formData, projectedRevenue: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1">
                            <DollarSign className="w-4 h-4 inline mr-1" />
                            Actual Revenue ($)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.actualRevenue}
                            onChange={(e) => setFormData({ ...formData, actualRevenue: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            placeholder="0.00"
                          />
                        </div>
                      </div>

                      {/* Tags */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                          <Tag className="w-4 h-4 inline mr-1" />
                          Tags
                        </label>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {formData.tags.map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-cyan-100 text-cyan-700 text-xs rounded-full flex items-center gap-1"
                            >
                              #{tag}
                              <button type="button" onClick={() => removeTag(tag)} className="hover:text-cyan-900">
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag(newTag))}
                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            placeholder="Add custom tag..."
                          />
                          <Button type="button" variant="outline" size="sm" onClick={() => addTag(newTag)}>
                            Add
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {suggestedTags.filter(t => !formData.tags.includes(t)).slice(0, 8).map(tag => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => addTag(tag)}
                              className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full hover:bg-slate-200"
                            >
                              +{tag}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Links */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                          <LinkIcon className="w-4 h-4 inline mr-1" />
                          Related Links
                        </label>
                        {formData.links.length > 0 && (
                          <div className="space-y-1 mb-2">
                            {formData.links.map((link, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <a href={link} target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:underline truncate flex-1">
                                  {link}
                                </a>
                                <button type="button" onClick={() => removeLink(index)} className="text-red-500 hover:text-red-700">
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={newLink}
                            onChange={(e) => setNewLink(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLink())}
                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            placeholder="https://..."
                          />
                          <Button type="button" variant="outline" size="sm" onClick={addLink}>
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Checklist Section */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleSection('checklist')}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <span className="font-semibold text-slate-700 flex items-center gap-2">
                      <CheckSquare className="w-5 h-5" />
                      Checklist & Progress ({formData.completionPercent}%)
                    </span>
                    {expandedSections.checklist ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  {expandedSections.checklist && (
                    <div className="p-4 space-y-4">
                      {/* Progress Bar */}
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-600">Completion</span>
                          <span className="font-semibold text-cyan-600">{formData.completionPercent}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-cyan-500 to-teal-500 h-2 rounded-full transition-all"
                            style={{ width: `${formData.completionPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Checklist Items */}
                      {formData.checklist.length > 0 && (
                        <div className="space-y-2">
                          {formData.checklist.map((item, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                              <input
                                type="checkbox"
                                checked={item.done}
                                onChange={() => toggleChecklistItem(index)}
                                className="w-5 h-5 text-cyan-600 border-slate-300 rounded focus:ring-cyan-500"
                              />
                              <span className={`flex-1 ${item.done ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                                {item.text}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeChecklistItem(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add Checklist Item */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newChecklistItem}
                          onChange={(e) => setNewChecklistItem(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addChecklistItem())}
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          placeholder="Add checklist item..."
                        />
                        <Button type="button" variant="outline" size="sm" onClick={addChecklistItem}>
                          Add
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Recurring Section */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleSection('recurring')}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <span className="font-semibold text-slate-700 flex items-center gap-2">
                      <Repeat className="w-5 h-5" />
                      Recurring & Reminders
                    </span>
                    {expandedSections.recurring ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  {expandedSections.recurring && (
                    <div className="p-4 space-y-4">
                      {/* Recurring */}
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="recurring"
                          checked={formData.recurring}
                          onChange={(e) => setFormData({ ...formData, recurring: e.target.checked })}
                          className="w-5 h-5 text-cyan-600 border-slate-300 rounded focus:ring-cyan-500"
                        />
                        <label htmlFor="recurring" className="text-sm font-medium text-slate-700">
                          Recurring event
                        </label>
                      </div>
                      {formData.recurring && (
                        <div className="grid grid-cols-2 gap-4 ml-8">
                          <div>
                            <label className="block text-sm text-slate-600 mb-1">Pattern</label>
                            <select
                              value={formData.recurringPattern}
                              onChange={(e) => setFormData({ ...formData, recurringPattern: e.target.value as 'daily' | 'weekly' | 'monthly' | 'yearly' })}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            >
                              <option value="daily">Daily</option>
                              <option value="weekly">Weekly</option>
                              <option value="monthly">Monthly</option>
                              <option value="yearly">Yearly</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm text-slate-600 mb-1">End Date</label>
                            <input
                              type="date"
                              value={formData.recurringEnd}
                              onChange={(e) => setFormData({ ...formData, recurringEnd: e.target.value })}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            />
                          </div>
                        </div>
                      )}

                      {/* Reminder */}
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="reminder"
                          checked={formData.reminder}
                          onChange={(e) => setFormData({ ...formData, reminder: e.target.checked })}
                          className="w-5 h-5 text-cyan-600 border-slate-300 rounded focus:ring-cyan-500"
                        />
                        <label htmlFor="reminder" className="text-sm font-medium text-slate-700">
                          <Bell className="w-4 h-4 inline mr-1" />
                          Set reminder
                        </label>
                      </div>
                      {formData.reminder && (
                        <div className="ml-8">
                          <label className="block text-sm text-slate-600 mb-1">Remind me before</label>
                          <select
                            value={formData.reminderTime}
                            onChange={(e) => setFormData({ ...formData, reminderTime: Number(e.target.value) })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          >
                            <option value={5}>5 minutes</option>
                            <option value={15}>15 minutes</option>
                            <option value={30}>30 minutes</option>
                            <option value={60}>1 hour</option>
                            <option value={1440}>1 day</option>
                          </select>
                        </div>
                      )}

                      {/* Attendees */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                          <Users className="w-4 h-4 inline mr-1" />
                          Attendees
                        </label>
                        <input
                          type="text"
                          value={formData.attendees.join(', ')}
                          onChange={(e) => setFormData({ ...formData, attendees: e.target.value.split(',').map(a => a.trim()) })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          placeholder="Enter names or emails, separated by commas"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4 border-t border-slate-200">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white"
                  >
                    {editingEvent ? 'Update Entry' : 'Create Entry'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
