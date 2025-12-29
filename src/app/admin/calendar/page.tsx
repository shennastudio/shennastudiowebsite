'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Plus, Edit, Trash2, X, Clock, MapPin, Users, Bell, Repeat, Filter, List, Grid3x3 } from 'lucide-react';
import toast from 'react-hot-toast';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string | null;
  date: string;
  time: string;
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
}

const eventColors = [
  { name: 'Ocean Blue', value: 'from-blue-500 to-cyan-500' },
  { name: 'Teal Green', value: 'from-teal-500 to-emerald-500' },
  { name: 'Coral Pink', value: 'from-pink-500 to-rose-500' },
  { name: 'Sunset Orange', value: 'from-orange-500 to-amber-500' },
  { name: 'Deep Purple', value: 'from-purple-500 to-violet-500' },
  { name: 'Sea Green', value: 'from-emerald-500 to-green-500' },
];

const categories = [
  { value: 'general', label: 'General', icon: '📋' },
  { value: 'meeting', label: 'Meeting', icon: '🤝' },
  { value: 'deadline', label: 'Deadline', icon: '⏰' },
  { value: 'personal', label: 'Personal', icon: '👤' },
  { value: 'marketing', label: 'Marketing', icon: '📢' },
  { value: 'product-launch', label: 'Product Launch', icon: '🚀' },
];

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'month' | 'list'>('month');
  const [filterCategory, setFilterCategory] = useState<string>('all');
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
    status: 'scheduled' as 'scheduled' | 'completed' | 'cancelled',
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/calendar');
      if (!response.ok) throw new Error('Failed to load events');

      const data = await response.json();
      setEvents(data.events.map((e: CalendarEvent) => ({
        ...e,
        date: new Date(e.date).toISOString().split('T')[0],
      })));
    } catch (error) {
      console.error('Load events error:', error);
      toast.error('Failed to load calendar events');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const method = editingEvent ? 'PATCH' : 'POST';
      const url = editingEvent
        ? `/api/admin/calendar/${editingEvent.id}`
        : '/api/admin/calendar';

      const payload = {
        ...formData,
        attendees: formData.attendees.filter(a => a.trim()),
        recurringPattern: formData.recurring ? formData.recurringPattern : null,
        recurringEnd: formData.recurring && formData.recurringEnd ? formData.recurringEnd : null,
        reminderTime: formData.reminder ? formData.reminderTime : null,
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to save event');

      toast.success(editingEvent ? 'Event updated!' : 'Event created!');
      resetForm();
      loadEvents();
    } catch (error) {
      console.error('Save event error:', error);
      toast.error('Failed to save event');
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
      time: event.time,
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
      status: event.status as 'scheduled' | 'completed' | 'cancelled',
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
    });
    setEditingEvent(null);
    setShowModal(false);
  };

  const getEventsForDate = (date: string) => {
    return events.filter(event => {
      if (filterCategory !== 'all' && event.category !== filterCategory) return false;
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

  const filteredEvents = filterCategory === 'all'
    ? events
    : events.filter(e => e.category === filterCategory);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-cyan-900 to-teal-900 bg-clip-text text-transparent">
            Calendar & Events
          </h1>
          <p className="text-slate-600 text-lg mt-1">Manage your schedule with advanced features</p>
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
          </div>
          <Button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>

      {/* Category Filter */}
      <Card className="border-slate-200/60 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">Filter by category:</span>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilterCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filterCategory === 'all'
                    ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Events
              </button>
              {categories.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => setFilterCategory(cat.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    filterCategory === cat.value
                      ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

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
                                className={`text-[10px] px-2 py-1 rounded bg-gradient-to-r ${event.color} text-white font-medium truncate hover:scale-105 transition-transform cursor-pointer`}
                                title={event.title}
                              >
                                {event.allDay ? '⏰ ' : `${event.time} `}
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
            <CardTitle>All Events</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p>No events found. Click &quot;Add Event&quot; to get started!</p>
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
                      <div className={`w-1 h-20 rounded-full bg-gradient-to-b ${event.color}`}></div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-slate-900 text-lg">{event.title}</h3>
                            {event.description && (
                              <p className="text-sm text-slate-600 mt-1">{event.description}</p>
                            )}
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            event.status === 'completed' ? 'bg-green-100 text-green-700' :
                            event.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {event.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3" />
                            {new Date(event.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {event.allDay ? 'All Day' : `${event.time}${event.endTime ? ` - ${event.endTime}` : ''}`}
                          </span>
                          {event.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {event.location}
                            </span>
                          )}
                          {event.attendees.length > 0 && (
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {event.attendees.length} attendees
                            </span>
                          )}
                          {event.recurring && (
                            <span className="flex items-center gap-1 text-purple-600">
                              <Repeat className="w-3 h-3" />
                              Recurring
                            </span>
                          )}
                          {event.reminder && (
                            <span className="flex items-center gap-1 text-amber-600">
                              <Bell className="w-3 h-3" />
                              Reminder
                            </span>
                          )}
                        </div>
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl my-8">
            <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white sticky top-0 z-10 shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{editingEvent ? 'Edit Event' : 'Add New Event'}</CardTitle>
                <Button variant="ghost" size="sm" onClick={resetForm}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-8 overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-base font-semibold text-slate-700 mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Enter event title"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-base font-semibold text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    rows={3}
                    placeholder="Event description (optional)"
                  />
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-base font-semibold text-slate-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-3 text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-base font-semibold text-slate-700 mb-2">
                      Start Time {!formData.allDay && '*'}
                    </label>
                    <input
                      type="time"
                      required={!formData.allDay}
                      disabled={formData.allDay}
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-4 py-3 text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-base font-semibold text-slate-700 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      disabled={formData.allDay}
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="w-full px-4 py-3 text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-slate-100"
                    />
                  </div>
                </div>

                {/* All Day Toggle */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="allDay"
                    checked={formData.allDay}
                    onChange={(e) => setFormData({ ...formData, allDay: e.target.checked })}
                    className="w-5 h-5 text-cyan-600 border-slate-300 rounded focus:ring-cyan-500"
                  />
                  <label htmlFor="allDay" className="text-base font-semibold text-slate-700">
                    All day event
                  </label>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-base font-semibold text-slate-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Color Theme */}
                <div>
                  <label className="block text-base font-semibold text-slate-700 mb-2">
                    Color Theme
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {eventColors.map(color => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: color.value })}
                        className={`h-12 rounded-lg bg-gradient-to-r ${color.value} ${
                          formData.color === color.value ? 'ring-4 ring-slate-300 scale-110' : ''
                        } transition-all hover:scale-105`}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-base font-semibold text-slate-700 mb-2">
                    <MapPin className="w-5 h-5 inline mr-1" />
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Event location (optional)"
                  />
                </div>

                {/* Recurring Event */}
                <div className="space-y-4 border border-slate-200 rounded-lg p-5">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="recurring"
                      checked={formData.recurring}
                      onChange={(e) => setFormData({ ...formData, recurring: e.target.checked })}
                      className="w-5 h-5 text-cyan-600 border-slate-300 rounded focus:ring-cyan-500"
                    />
                    <label htmlFor="recurring" className="text-base font-semibold text-slate-700">
                      <Repeat className="w-5 h-5 inline mr-1" />
                      Recurring event
                    </label>
                  </div>

                  {formData.recurring && (
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <label className="block text-base font-medium text-slate-600 mb-2">Pattern</label>
                        <select
                          value={formData.recurringPattern || 'weekly'}
                          onChange={(e) => setFormData({ ...formData, recurringPattern: e.target.value as 'daily' | 'weekly' | 'monthly' | 'yearly' })}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg text-base"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="yearly">Yearly</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-base font-medium text-slate-600 mb-2">End Date</label>
                        <input
                          type="date"
                          value={formData.recurringEnd}
                          onChange={(e) => setFormData({ ...formData, recurringEnd: e.target.value })}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg text-base"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Reminder */}
                <div className="space-y-4 border border-slate-200 rounded-lg p-5">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="reminder"
                      checked={formData.reminder}
                      onChange={(e) => setFormData({ ...formData, reminder: e.target.checked })}
                      className="w-5 h-5 text-cyan-600 border-slate-300 rounded focus:ring-cyan-500"
                    />
                    <label htmlFor="reminder" className="text-base font-semibold text-slate-700">
                      <Bell className="w-5 h-5 inline mr-1" />
                      Set reminder
                    </label>
                  </div>

                  {formData.reminder && (
                    <div>
                      <label className="block text-base font-medium text-slate-600 mb-2">Remind me before</label>
                      <select
                        value={formData.reminderTime}
                        onChange={(e) => setFormData({ ...formData, reminderTime: Number(e.target.value) })}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg text-base"
                      >
                        <option value={5}>5 minutes</option>
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                        <option value={60}>1 hour</option>
                        <option value={1440}>1 day</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Status (for editing) */}
                {editingEvent && (
                  <div>
                    <label className="block text-base font-semibold text-slate-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as 'scheduled' | 'completed' | 'cancelled' })}
                      className="w-full px-4 py-3 text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-slate-200">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white"
                  >
                    {editingEvent ? 'Update Event' : 'Create Event'}
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
