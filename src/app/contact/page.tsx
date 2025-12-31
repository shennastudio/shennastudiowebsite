'use client'

import { useState } from 'react'
import AnimatedSection, { StaggeredChildren } from '@/components/AnimatedSection'

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
        <AnimatedSection animation="scaleIn" className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-10 text-center">
            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
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
              className="w-full bg-teal-600 text-white font-bold py-4 rounded-xl hover:bg-teal-700 transition-all shadow-lg hover:scale-105 transform"
            >
              Send Another Message
            </button>
          </div>
        </AnimatedSection>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-teal-600 to-blue-600 py-16 text-white text-center relative overflow-hidden">
        {/* Animated wave background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1440 320%22%3E%3Cpath fill=%22%23ffffff%22 d=%22M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,181.3C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z%22%3E%3C/path%3E%3C/svg%3E')] bg-cover bg-bottom animate-pulse" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection animation="fadeInDown">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-white">Contact Us</h1>
            <p className="text-xl text-cyan-100">
              Have questions about our ocean conservation mission or custom handmade bracelets? We&apos;d love to hear from you!
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-16 -mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <StaggeredChildren className="lg:col-span-1 space-y-8" staggerDelay={150}>
              <div className="stagger-child bg-white rounded-2xl shadow-lg p-8 transform hover:scale-105 transition-transform duration-300 hover:shadow-xl">
                <div className="flex items-center gap-4 mb-4 text-teal-600">
                  <span className="text-2xl">🪼</span>
                  <h3 className="text-xl font-bold text-gray-900">Conservation Mission</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Support our mission to protect South Padre Island and Rio Grande Valley marine life. 
                  10% of every purchase goes directly to local conservation partners.
                </p>
              </div>

              <div className="stagger-child bg-white rounded-2xl shadow-lg p-8 transform hover:scale-105 transition-transform duration-300 hover:shadow-xl">
                <div className="flex items-center gap-4 mb-4 text-blue-600">
                  <span className="text-2xl">🐚</span>
                  <h3 className="text-xl font-bold text-gray-900">Custom Designs</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Looking for a unique ocean-inspired design? We love creating custom pieces
                  that capture your personal connection to the sea.
                </p>
              </div>

              <div className="stagger-child bg-white rounded-2xl shadow-lg p-8 transform hover:scale-105 transition-transform duration-300 hover:shadow-xl">
                <div className="flex items-center gap-4 mb-4 text-cyan-600">
                  <span className="text-2xl">📍</span>
                  <h3 className="text-xl font-bold text-gray-900">Our Studio</h3>
                </div>
                <p className="text-gray-800 text-sm font-semibold mb-2">
                  Shenna Studio LLC
                </p>
                <p className="text-gray-600 text-sm leading-relaxed mb-1">
                  2436 Pablo Kisel Blvd
                </p>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                  Brownsville, TX 78520
                </p>
                <p className="text-gray-600 text-sm leading-relaxed mb-1">
                  Rio Grande Valley / South Padre Island
                </p>
                <a
                  href="mailto:info@shennastudio.com"
                  className="text-teal-600 hover:text-teal-700 text-sm font-medium mt-3 inline-block"
                >
                  info@shennastudio.com
                </a>
              </div>
            </StaggeredChildren>

            <AnimatedSection animation="fadeInRight" delay={200} className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
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
                      className="w-full bg-teal-600 text-white font-bold py-4 rounded-xl hover:bg-teal-700 transition-all shadow-lg flex items-center justify-center gap-2 hover:scale-105 transform"
                    >
                      <span>Send Message</span>
                    </button>
                  </form>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  )
}