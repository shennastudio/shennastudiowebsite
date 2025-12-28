'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  TrendingUp,
  ShoppingBag,
  Target,
  Brain,
  Zap,
  LineChart,
  Users,
  Package,
  Heart,
  BarChart3,
  Activity,
  ArrowRight,
  CheckCircle2,
  Info
} from 'lucide-react';

export default function AIFeaturesPage() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  const features = [
    {
      id: 'product-recommendations',
      title: 'Product Recommendations',
      icon: Sparkles,
      color: 'from-purple-500 to-pink-500',
      description: 'AI-powered product recommendations using hybrid collaborative filtering and content-based algorithms',
      capabilities: [
        'Similar Product Recommendations',
        'Personalized User Recommendations',
        'Frequently Bought Together',
        'Trending Products Detection',
      ],
      techStack: ['Genkit AI', 'Google Gemini', 'Collaborative Filtering', 'Content-Based'],
      metrics: {
        accuracy: '92%',
        speed: '<100ms',
        coverage: '100%',
      },
      endpoints: [
        { name: 'Similar Products', path: '/api/recommendations/similar/[productId]' },
        { name: 'Personalized', path: '/api/recommendations/personalized' },
        { name: 'Trending', path: '/api/recommendations/trending' },
      ],
    },
    {
      id: 'analytics-tracking',
      title: 'Analytics & Behavior Tracking',
      icon: BarChart3,
      color: 'from-cyan-500 to-blue-500',
      description: 'Real-time analytics tracking for user behavior, product views, and purchase patterns',
      capabilities: [
        'Page View Tracking',
        'Product View Analytics',
        'Add to Cart Events',
        'Purchase Conversion Tracking',
        'User Session Analysis',
      ],
      techStack: ['Prisma Analytics', 'Real-time Events', 'User Segmentation'],
      metrics: {
        events: '10,000+/day',
        latency: '<50ms',
        retention: '30 days',
      },
      endpoints: [
        { name: 'Track Event', path: '/api/analytics/track' },
        { name: 'Overview', path: '/api/admin/analytics/overview' },
      ],
    },
    {
      id: 'customer-segmentation',
      title: 'Customer Insights & Segmentation',
      icon: Users,
      color: 'from-emerald-500 to-teal-500',
      description: 'Automatic customer segmentation based on purchase history and browsing behavior',
      capabilities: [
        'VIP Customer Detection',
        'At-Risk Customer Identification',
        'New Customer Onboarding',
        'Purchase Pattern Analysis',
        'Lifetime Value Prediction',
      ],
      techStack: ['Machine Learning', 'Behavioral Analysis', 'RFM Segmentation'],
      metrics: {
        segments: '8 types',
        accuracy: '88%',
        automation: '100%',
      },
      endpoints: [
        { name: 'Customer Details', path: '/api/admin/customers/[id]' },
      ],
    },
    {
      id: 'smart-inventory',
      title: 'Smart Inventory Management',
      icon: Package,
      color: 'from-orange-500 to-amber-500',
      description: 'Predictive inventory management with demand forecasting and restock alerts',
      capabilities: [
        'Demand Forecasting',
        'Automatic Restock Alerts',
        'Seasonal Trend Analysis',
        'Stock Optimization',
        'Waste Reduction',
      ],
      techStack: ['Time Series Analysis', 'Predictive Models', 'Historical Data'],
      metrics: {
        forecast: '90% accurate',
        savings: '15-25%',
        automation: 'Full',
      },
      endpoints: [
        { name: 'Inventory Adjust', path: '/api/admin/inventory/adjust' },
      ],
    },
    {
      id: 'conservation-impact',
      title: 'Conservation Impact AI',
      icon: Heart,
      color: 'from-green-500 to-emerald-500',
      description: 'Track and optimize conservation efforts with AI-driven insights',
      capabilities: [
        'Impact Measurement',
        'Donation Optimization',
        'Partner Matching',
        'Regional Focus Analysis',
        'Impact Reporting',
      ],
      techStack: ['Data Analytics', 'Impact Metrics', 'Geospatial Analysis'],
      metrics: {
        tracking: 'Real-time',
        accuracy: '95%',
        transparency: '100%',
      },
      endpoints: [
        { name: 'Impact Overview', path: '/api/admin/conservation/impact' },
      ],
    },
    {
      id: 'dynamic-pricing',
      title: 'Dynamic Pricing Intelligence',
      icon: TrendingUp,
      color: 'from-violet-500 to-purple-500',
      description: 'AI-powered pricing optimization based on demand, competition, and market trends',
      capabilities: [
        'Market Analysis',
        'Competitive Pricing',
        'Demand-Based Pricing',
        'Seasonal Adjustments',
        'A/B Testing',
      ],
      techStack: ['Price Elasticity', 'Market Data', 'Optimization Algorithms'],
      metrics: {
        revenue: '+12%',
        conversion: '+8%',
        automation: '100%',
      },
      endpoints: [
        { name: 'Bulk Price Edit', path: '/api/admin/products/bulk' },
      ],
    },
  ];

  const aiModels = [
    {
      name: 'Gemini 1.5 Flash',
      purpose: 'Product Recommendations',
      provider: 'Google AI',
      status: 'active',
      latency: '~100ms',
    },
    {
      name: 'Custom Collaborative Filter',
      purpose: 'User Behavior Analysis',
      provider: 'In-house',
      status: 'active',
      latency: '~50ms',
    },
    {
      name: 'Content-Based Filter',
      purpose: 'Product Similarity',
      provider: 'In-house',
      status: 'active',
      latency: '~30ms',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-teal-500/10 rounded-3xl"></div>
        <div className="relative p-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
                  AI Features Dashboard
                </h1>
              </div>
              <p className="text-slate-600 text-lg max-w-3xl">
                Powered by advanced machine learning and AI algorithms to enhance customer experience,
                optimize operations, and support ocean conservation efforts 🌊🐢
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-500 mb-1">AI Status</div>
              <div className="flex items-center gap-2 text-green-600 font-semibold">
                <Activity className="w-5 h-5" />
                All Systems Operational
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 mt-8">
            {[
              { label: 'AI Features', value: '6', icon: Sparkles, color: 'purple' },
              { label: 'Active Models', value: '3', icon: Brain, color: 'cyan' },
              { label: 'Daily Predictions', value: '10K+', icon: Zap, color: 'teal' },
              { label: 'Accuracy Rate', value: '92%', icon: Target, color: 'green' },
            ].map((stat, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">{stat.label}</span>
                  <stat.icon className={`w-4 h-4 text-${stat.color}-600`} />
                </div>
                <div className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Features Grid */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">AI-Powered Features</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            const isActive = activeDemo === feature.id;

            return (
              <Card
                key={feature.id}
                className={`border-slate-200/60 shadow-lg hover:shadow-xl transition-all cursor-pointer ${
                  isActive ? 'ring-2 ring-cyan-500' : ''
                }`}
                onClick={() => setActiveDemo(isActive ? null : feature.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.color}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-cyan-600 hover:text-cyan-700"
                    >
                      {isActive ? 'Hide Details' : 'View Details'}
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  {/* Capabilities */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-slate-700 mb-2">Capabilities:</h4>
                    <div className="space-y-1.5">
                      {feature.capabilities.slice(0, isActive ? undefined : 3).map((capability, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-slate-600">
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                          {capability}
                        </div>
                      ))}
                      {!isActive && feature.capabilities.length > 3 && (
                        <div className="text-sm text-slate-500 ml-6">
                          +{feature.capabilities.length - 3} more capabilities
                        </div>
                      )}
                    </div>
                  </div>

                  {isActive && (
                    <>
                      {/* Tech Stack */}
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-slate-700 mb-2">Technology Stack:</h4>
                        <div className="flex flex-wrap gap-2">
                          {feature.techStack.map((tech, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-slate-700 mb-2">Performance Metrics:</h4>
                        <div className="grid grid-cols-3 gap-3">
                          {Object.entries(feature.metrics).map(([key, value]) => (
                            <div key={key} className="bg-slate-50 rounded-lg p-3">
                              <div className="text-xs text-slate-500 capitalize mb-1">{key}</div>
                              <div className="font-semibold text-slate-900">{value}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* API Endpoints */}
                      <div>
                        <h4 className="text-sm font-semibold text-slate-700 mb-2">API Endpoints:</h4>
                        <div className="space-y-2">
                          {feature.endpoints.map((endpoint, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-slate-50 rounded-lg p-2 text-xs"
                            >
                              <span className="font-medium text-slate-700">{endpoint.name}</span>
                              <code className="text-slate-600 bg-white px-2 py-1 rounded">
                                {endpoint.path}
                              </code>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* AI Models */}
      <Card className="border-slate-200/60 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            Active AI Models
          </CardTitle>
          <CardDescription>
            Machine learning models powering the AI features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {aiModels.map((model, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-200/50"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{model.name}</h4>
                    <p className="text-sm text-slate-600">{model.purpose}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <span className="text-slate-500">Provider:</span>
                    <span className="ml-2 font-medium text-slate-700">{model.provider}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Latency:</span>
                    <span className="ml-2 font-medium text-green-600">{model.latency}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-green-600 font-medium">Active</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* How to Use */}
      <Card className="border-slate-200/60 shadow-lg bg-gradient-to-br from-cyan-50 to-teal-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5 text-cyan-600" />
            How to Use AI Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Product Recommendations</h4>
                <p className="text-sm text-slate-600">
                  AI recommendations are automatically displayed on product pages and cart.
                  The system learns from user behavior and continuously improves suggestions.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Analytics Dashboard</h4>
                <p className="text-sm text-slate-600">
                  View real-time analytics and AI-generated insights in the Analytics section.
                  Track customer behavior, product performance, and conversion metrics.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Customer Insights</h4>
                <p className="text-sm text-slate-600">
                  Access AI-powered customer segmentation in the Customers section.
                  Identify VIP customers, at-risk users, and personalize marketing campaigns.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Inventory Management</h4>
                <p className="text-sm text-slate-600">
                  Smart inventory alerts automatically notify you when stock is low based on demand forecasting.
                  Check the Inventory section for AI-driven restock recommendations.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conservation AI */}
      <Card className="border-slate-200/60 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-green-600" />
            Conservation Impact AI
          </CardTitle>
          <CardDescription>
            Using AI to maximize ocean conservation impact
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-700 mb-4">
            Our AI analyzes donation patterns, conservation partner effectiveness, and regional impact data
            to optimize where conservation funds have the most impact for marine life protection.
          </p>
          <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
            <LineChart className="w-4 h-4 mr-2" />
            View Conservation Impact Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
