'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Plus, Edit, Trash2, X, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  color: string;
  category: string;
}

const eventColors = [
  { name: 'Ocean Blue', value: 'from-blue-500 to-cyan-500' },
  { name: 'Teal Green', value: 'from-teal-500 to-emerald-500' },
  { name: 'Coral Pink', value: 'from-pink-500 to-rose-500' },
  { name: 'Sunset Orange', value: 'from-orange-500 to-amber-500' },
  { name: 'Deep Purple', value: 'from-purple-500 to-violet-500' },
];

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    color: eventColors[0].value,
    category: 'general'
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    const saved = localStorage.getItem('calendar_events');
    if (saved) {
      setEvents(JSON.parse(saved));
    }
  };

  const saveEvents = (newEvents: CalendarEvent[]) => {
    localStorage.setItem('calendar_events', JSON.stringify(newEvents));
    setEvents(newEvents);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingEvent) {
      const updated = events.map(event =>
        event.id === editingEvent.id
          ? { ...formData, id: event.id }
          : event
      );
      saveEvents(updated);
      toast.success('Event updated successfully!');
    } else {
      const newEvent: CalendarEvent = {
        ...formData,
        id: Date.now().toString(),
      };
      saveEvents([...events, newEvent]);
      toast.success('Event created successfully!');
    }

    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      saveEvents(events.filter(event => event.id !== id));
      toast.success('Event deleted');
    }
  };

  const handleEdit = (event: CalendarEvent) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      date: event.date,
      time: event.time,
      color: event.color,
      category: event.category
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      color: eventColors[0].value,
      category: 'general'
    });
    setEditingEvent(null);
    setShowModal(false);
  };

  const getEventsForDate = (date: string) => {
    return events.filter(event => event.date === date);
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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-cyan-900 to-teal-900 bg-clip-text text-transparent">
            Calendar & Events
          </h1>
          <p className="text-slate-600 text-lg mt-1">Manage your schedule and important dates</p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </div>

      {/* Calendar Grid */}
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
                  className={`min-h-[100px] p-2 border border-slate-200 rounded-lg ${
                    day ? 'bg-white hover:bg-slate-50 cursor-pointer transition-colors' : 'bg-slate-50'
                  } ${isToday ? 'ring-2 ring-cyan-500' : ''}`}
                >
                  {day && (
                    <>
                      <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-cyan-600' : 'text-slate-700'}`}>
                        {day}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map(event => (
                          <div
                            key={event.id}
                            className={`text-[10px] px-2 py-1 rounded bg-gradient-to-r ${event.color} text-white font-medium truncate`}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-[10px] text-slate-500 px-2">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card className="border-slate-200/60 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/60">
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {events.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p>No events scheduled. Click "Add Event" to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {events
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map(event => (
                  <div
                    key={event.id}
                    className="flex items-center gap-4 p-4 bg-white border border-slate-200/60 rounded-xl hover:shadow-lg transition-shadow"
                  >
                    <div className={`w-1 h-16 rounded-full bg-gradient-to-b ${event.color}`}></div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">{event.title}</h3>
                      {event.description && (
                        <p className="text-sm text-slate-600 mt-1">{event.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="w-3 h-3" />
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {event.time}
                        </span>
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl shadow-2xl">
            <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center justify-between">
                <CardTitle>{editingEvent ? 'Edit Event' : 'Add New Event'}</CardTitle>
                <Button variant="ghost" size="sm" onClick={resetForm}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Enter event title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    rows={3}
                    placeholder="Event description (optional)"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Time *
                    </label>
                    <input
                      type="time"
                      required
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Color Theme
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {eventColors.map(color => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: color.value })}
                        className={`h-12 rounded-lg bg-gradient-to-r ${color.value} ${
                          formData.color === color.value ? 'ring-4 ring-slate-300' : ''
                        } transition-all hover:scale-105`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
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
