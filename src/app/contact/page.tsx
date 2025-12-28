'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10 text-center">
          <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl text-teal-600">🌊</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Message Sent!</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Your message has been received. We&apos;ll get back to you within 24 hours to discuss ocean conservation and custom bracelets.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
            }}
            className="w-full bg-teal-600 text-white font-bold py-4 rounded-xl hover:bg-teal-700 transition-all shadow-lg"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-teal-600 to-blue-600 py-16 text-white text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-cyan-100">
            Have questions about our ocean conservation mission or custom handmade bracelets? We&apos;d love to hear from you!
          </p>
        </div>
      </section>

      <section className="py-16 -mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white rounded-2xl shadow-lg p-8 transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center gap-4 mb-4 text-teal-600">
                  <span className="text-2xl">🪼</span>
                  <h3 className="text-xl font-bold text-gray-900">Conservation Mission</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Support our mission to protect South Padre Island and Rio Grande Valley marine life. 
                  10% of every purchase goes directly to local conservation partners.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8 transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center gap-4 mb-4 text-blue-600">
                  <span className="text-2xl">🐚</span>
                  <h3 className="text-xl font-bold text-gray-900">Custom Designs</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Looking for a unique ocean-inspired design? We love creating custom pieces 
                  that capture your personal connection to the sea.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8 transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center gap-4 mb-4 text-cyan-600">
                  <span className="text-2xl">📍</span>
                  <h3 className="text-xl font-bold text-gray-900">Our Studio</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Rio Grande Valley / South Padre Island, Texas
                </p>
                <p className="text-gray-600 text-sm mt-2 font-medium">
                  info@shennastudio.com
                </p>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-8 md:p-12">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                          placeholder="Your Name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                          placeholder="(optional)"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                        <input
                          type="text"
                          name="subject"
                          required
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                          placeholder="How can we help?"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                      <textarea
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all resize-none"
                        placeholder="Tell us about your custom design or conservation question..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-teal-600 text-white font-bold py-4 rounded-xl hover:bg-teal-700 transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      <span>Send Message</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}