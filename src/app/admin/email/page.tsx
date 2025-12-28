'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Mail,
  Send,
  Inbox,
  Trash2,
  Archive,
  Plus,
  Paperclip,
  Bold,
  Italic,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function EmailClientPage() {
  const [composing, setComposing] = useState(false);
  const [emailData, setEmailData] = useState({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    body: '',
  });

  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/admin/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Email sent successfully!');
        setEmailData({ to: '', cc: '', bcc: '', subject: '', body: '' });
        setComposing(false);
      } else {
        toast.error(data.error || 'Failed to send email');
      }
    } catch (error) {
      console.error('Send email error:', error);
      toast.error('Failed to send email');
    }
  };

  const insertText = (before: string, after: string = '') => {
    const textarea = document.getElementById('email-body') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
    setEmailData({ ...emailData, body: newText });

    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 10);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-cyan-900 to-teal-900 bg-clip-text text-transparent">
            Email Client
          </h1>
          <p className="text-slate-600 text-lg mt-1">Send and manage your emails</p>
        </div>
        <Button
          onClick={() => setComposing(true)}
          className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Compose Email
        </Button>
      </div>

      {composing ? (
        <Card className="border-slate-200/60 shadow-xl">
          <CardHeader className="border-b border-slate-200/60 bg-gradient-to-r from-slate-50 to-white">
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-cyan-600" />
              New Message
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSend} className="space-y-4">
              {/* To Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">To *</label>
                <input
                  type="email"
                  required
                  value={emailData.to}
                  onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="recipient@example.com"
                />
                <div className="flex gap-2 mt-2">
                  {!showCc && (
                    <button
                      type="button"
                      onClick={() => setShowCc(true)}
                      className="text-xs text-cyan-600 hover:text-cyan-700"
                    >
                      + Cc
                    </button>
                  )}
                  {!showBcc && (
                    <button
                      type="button"
                      onClick={() => setShowBcc(true)}
                      className="text-xs text-cyan-600 hover:text-cyan-700"
                    >
                      + Bcc
                    </button>
                  )}
                </div>
              </div>

              {/* CC Field */}
              {showCc && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Cc</label>
                  <input
                    type="email"
                    value={emailData.cc}
                    onChange={(e) => setEmailData({ ...emailData, cc: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="cc@example.com"
                  />
                </div>
              )}

              {/* BCC Field */}
              {showBcc && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Bcc</label>
                  <input
                    type="email"
                    value={emailData.bcc}
                    onChange={(e) => setEmailData({ ...emailData, bcc: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="bcc@example.com"
                  />
                </div>
              )}

              {/* Subject Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Subject *</label>
                <input
                  type="text"
                  required
                  value={emailData.subject}
                  onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Email subject"
                />
              </div>

              {/* Formatting Toolbar */}
              <div className="border border-slate-300 rounded-t-lg bg-slate-50 p-2 flex flex-wrap gap-1">
                <button
                  type="button"
                  onClick={() => insertText('**', '**')}
                  className="p-2 hover:bg-slate-200 rounded transition-colors"
                  title="Bold"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertText('*', '*')}
                  className="p-2 hover:bg-slate-200 rounded transition-colors"
                  title="Italic"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <div className="w-px bg-slate-300 mx-1"></div>
                <button
                  type="button"
                  onClick={() => insertText('[Link Text](https://)', '')}
                  className="p-2 hover:bg-slate-200 rounded transition-colors"
                  title="Insert Link"
                >
                  <LinkIcon className="w-4 h-4" />
                </button>
                <div className="w-px bg-slate-300 mx-1"></div>
                <button
                  type="button"
                  onClick={() => insertText('- ', '\n')}
                  className="p-2 hover:bg-slate-200 rounded transition-colors"
                  title="Bullet List"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Message Body */}
              <div>
                <textarea
                  id="email-body"
                  required
                  value={emailData.body}
                  onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 border-t-0 rounded-b-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent min-h-[300px] font-mono text-sm"
                  placeholder="Write your message here...

You can use basic markdown formatting:
**bold text**
*italic text*
[link text](https://example.com)
- bullet points"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Paperclip className="w-4 h-4" />
                    Attach File
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setComposing(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white shadow-lg gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send Email
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Inbox Card */}
          <Card className="border-blue-200/60 shadow-lg hover:shadow-xl transition-shadow group cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl group-hover:scale-110 transition-transform">
                  <Inbox className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Inbox</h3>
                  <p className="text-sm text-slate-600">View received emails</p>
                  <p className="text-xs text-slate-500 mt-1">Coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sent Card */}
          <Card className="border-green-200/60 shadow-lg hover:shadow-xl transition-shadow group cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl group-hover:scale-110 transition-transform">
                  <Send className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Sent</h3>
                  <p className="text-sm text-slate-600">View sent emails</p>
                  <p className="text-xs text-slate-500 mt-1">Check Email Logs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Archive Card */}
          <Card className="border-purple-200/60 shadow-lg hover:shadow-xl transition-shadow group cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-purple-100 to-violet-100 rounded-xl group-hover:scale-110 transition-transform">
                  <Archive className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Archive</h3>
                  <p className="text-sm text-slate-600">Archived messages</p>
                  <p className="text-xs text-slate-500 mt-1">Coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Info */}
      {!composing && (
        <Card className="border-slate-200/60 shadow-lg bg-gradient-to-br from-cyan-50 to-teal-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-cyan-600 mt-1" />
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Email Client Features</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-600"></div>
                    Send emails directly from your admin panel
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-600"></div>
                    Support for Cc and Bcc recipients
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-600"></div>
                    Markdown formatting support
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-600"></div>
                    Track sent emails in Email Logs
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
