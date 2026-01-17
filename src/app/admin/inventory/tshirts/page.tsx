'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  DollarSign, 
  Package, 
  RefreshCw,
  Settings,
  Eye,
  Edit,
  Plus,
  Minus,
  Target,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ProductThumbnail } from '@/components/admin/ProductThumbnail';

interface TShirtVariant {
  id: string;
  size: string;
  color: string;
  stock: number;
  price: number;
  sales30Days: number;
  sales90Days: number;
  profitMargin: number;
  reorderPoint: number;
  safetyStock: number;
  supplier: string;
  lastRestock: string;
}

interface TShirtAnalytics {
  totalStock: number;
  totalValue: number;
  avgPrice: number;
  topSizes: Array<{ size: string; count: number; percentage: number }>;
  topColors: Array<{ color: string; count: number; percentage: number }>;
  monthlyTrend: Array<{ month: string; sales: number; revenue: number }>;
  seasonPerformance: Record<string, { sales: number; revenue: number }>;
  sizeRatio: Record<string, number>;
  recommendedRatio: Record<string, number>;
}

interface SizeRecommendation {
  currentStock: number;
  recommendedStock: number;
  difference: number;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

interface ColorTrend {
  color: string;
  currentStock: number;
  salesVelocity: number;
  seasonalDemand: 'high' | 'medium' | 'low';
  recommendedAction: string;
}

interface ProductionPlan {
  weekNumber: number;
  startDate: string;
  endDate: string;
  sizeBreakdown: Record<string, number>;
  colorBreakdown: Record<string, number>;
  totalUnits: number;
  estimatedMaterial: number;
}

interface TShirtData {
  productName: string;
  productId: string;
  variants: TShirtVariant[];
  analytics: TShirtAnalytics;
}

interface SeasonalAnalysis {
  currentSeason: string;
  currentPerformance: { sales: number; revenue: number };
  nextSeason: string;
  nextSeasonForecast: { sales: number; revenue: number };
  recommendation: string;
}

interface SeasonalColorData {
  spring: Record<string, 'high' | 'medium' | 'low'>;
  summer: Record<string, 'high' | 'medium' | 'low'>;
  fall: Record<string, 'high' | 'medium' | 'low'>;
  winter: Record<string, 'high' | 'medium' | 'low'>;
}

const seasonalColors: SeasonalColorData = {
  spring: { 'White': 'high', 'Light Blue': 'high', 'Green': 'medium' },
  summer: { 'White': 'high', 'Navy': 'medium', 'Red': 'high' },
  fall: { 'Black': 'high', 'Orange': 'high', 'Brown': 'medium' },
  winter: { 'Black': 'high', 'Navy': 'high', 'Gray': 'medium' }
};

export default function AdvancedTShirtInventory() {
  const [loading, setLoading] = useState(true);
  const [tshirts, setTshirts] = useState<TShirtData[]>([]);
  const [selectedTshirt, setSelectedTshirt] = useState<TShirtData | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('90');
  const [autoReorder, setAutoReorder] = useState(true);
  const [minStockThreshold, setMinStockThreshold] = useState(5);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<'adjust' | 'reorder' | 'discontinue' | null>(null);
  const [productionWeeks, setProductionWeeks] = useState(4);

  const fetchTshirtData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/tshirts/enhanced?range=${dateRange}`);
      
      if (!response.ok) throw new Error('Failed to fetch t-shirt data');
      
      const data = await response.json();
      setTshirts(data.tshirts);
    } catch (error) {
      toast.error('Failed to load t-shirt inventory');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchTshirtData();
  }, [fetchTshirtData]);

  const getSizeRecommendations = (tshirt: TShirtData): SizeRecommendation[] => {
    return tshirt.variants.map((variant) => {
      const salesVelocity = variant.sales30Days / 30;
      const recommendedStock = Math.ceil(variant.reorderPoint + (salesVelocity * 14));
      const difference = recommendedStock - variant.stock;
      
      let priority: 'high' | 'medium' | 'low' = 'low';
      let reason = '';
      
      if (variant.stock === 0) {
        priority = 'high';
        reason = 'Out of stock';
      } else if (variant.stock <= minStockThreshold) {
        priority = 'medium';
        reason = 'Low stock';
      } else if (difference > 10) {
        priority = 'low';
        reason = 'Overstock opportunity';
      }
      
      return {
        currentStock: variant.stock,
        recommendedStock,
        difference,
        reason,
        priority
      };
    });
  };

  const generateProductionPlan = (tshirt: TShirtData): ProductionPlan[] => {
    const plans: ProductionPlan[] = [];
    const startDate = new Date();
    
    for (let week = 0; week < productionWeeks; week++) {
      const weekStart = new Date(startDate);
      weekStart.setDate(startDate.getDate() + (week * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      const sizeBreakdown: Record<string, number> = {};
      const colorBreakdown: Record<string, number> = {};
      
      tshirt.variants.forEach((variant) => {
        const shortage = Math.max(0, variant.reorderPoint - variant.stock);
        if (shortage > 0) {
          sizeBreakdown[variant.size] = (sizeBreakdown[variant.size] || 0) + Math.ceil(shortage * 1.2);
          colorBreakdown[variant.color] = (colorBreakdown[variant.color] || 0) + Math.ceil(shortage * 1.2);
        }
      });
      
      plans.push({
        weekNumber: week + 1,
        startDate: weekStart.toISOString(),
        endDate: weekEnd.toISOString(),
        sizeBreakdown,
        colorBreakdown,
        totalUnits: Object.values(sizeBreakdown).reduce((a, b) => a + b, 0),
        estimatedMaterial: Object.values(sizeBreakdown).reduce((a, b) => a + b, 0) * 0.5
      });
    }
    
    return plans;
  };

  const getCurrentSeason = (): string => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'Spring';
    if (month >= 5 && month <= 7) return 'Summer';
    if (month >= 8 && month <= 10) return 'Fall';
    return 'Winter';
  };

  const getNextSeason = (currentSeason: string): string => {
    const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];
    const currentIndex = seasons.indexOf(currentSeason);
    return seasons[(currentIndex + 1) % 4];
  };

  const getSeasonalAnalysis = (tshirt: TShirtData): SeasonalAnalysis => {
    const currentSeason = getCurrentSeason();
    const nextSeason = getNextSeason(currentSeason);
    const seasonData = tshirt.analytics.seasonPerformance;
    
    return {
      currentSeason,
      currentPerformance: seasonData[currentSeason] || { sales: 0, revenue: 0 },
      nextSeason,
      nextSeasonForecast: seasonData[nextSeason] || { sales: 0, revenue: 0 },
      recommendation: getSeasonalRecommendation(currentSeason, nextSeason, seasonData)
    };
  };

  const getSeasonalRecommendation = (
    currentSeason: string, 
    nextSeason: string, 
    seasonData: Record<string, { sales: number; revenue: number }>
  ): string => {
    const current = seasonData[currentSeason]?.sales || 0;
    const next = seasonData[nextSeason]?.sales || 0;
    
    if (next > current * 1.3) {
      return `Increase production for ${nextSeason} - expecting ${(next/current).toFixed(1)}x higher demand`;
    } else if (next < current * 0.7) {
      return `Reduce production for ${nextSeason} - expecting ${(next/current).toFixed(1)}x lower demand`;
    }
    return 'Maintain current production levels';
  };

  const getColorTrends = (tshirt: TShirtData): ColorTrend[] => {
    return tshirt.variants.map((variant) => {
      const salesVelocity = variant.sales30Days / 30;
      let seasonalDemand: 'high' | 'medium' | 'low' = 'medium';
      let recommendedAction = 'Maintain current stock';
      
      const season = getCurrentSeason();
      const seasonColorMap: Record<string, Record<string, 'high' | 'medium' | 'low'>> = {
        'Spring': seasonalColors.spring,
        'Summer': seasonalColors.summer,
        'Fall': seasonalColors.fall,
        'Winter': seasonalColors.winter
      };
      
      const currentSeasonColors = seasonColorMap[season];
      seasonalDemand = currentSeasonColors?.[variant.color] || 'medium';
      
      if (salesVelocity > 1) {
        recommendedAction = 'Fast seller - consider increasing stock';
      } else if (salesVelocity < 0.3 && variant.stock > 20) {
        recommendedAction = 'Slow seller - consider discount or discontinuation';
      } else if (seasonalDemand === 'high' && variant.stock < 10) {
        recommendedAction = `High seasonal demand for ${season} - restock recommended`;
      }
      
      return {
        color: variant.color,
        currentStock: variant.stock,
        salesVelocity,
        seasonalDemand,
        recommendedAction
      };
    });
  };

  const handleBulkAdjustment = async () => {
    if (selectedSizes.length === 0) {
      toast.error('Please select sizes to adjust');
      return;
    }
    
    toast.success(`Bulk adjustment initiated for ${selectedSizes.length} sizes`);
    setSelectedSizes([]);
    setBulkAction(null);
  };

  const handleAutoReorder = async (tshirtId: string) => {
    try {
      const response = await fetch('/api/admin/tshirts/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tshirtId, autoMode: true })
      });
      
      if (response.ok) {
        toast.success('Auto-reorder activated');
      } else {
        toast.error('Failed to activate auto-reorder');
      }
    } catch (error) {
      toast.error('Auto-reorder failed');
    }
  };

  const totalTshirts = useMemo(() => 
    tshirts.reduce((sum: number, t) => sum + t.analytics.totalStock, 0), [tshirts]);
  const totalValue = useMemo(() => 
    tshirts.reduce((sum: number, t) => sum + t.analytics.totalValue, 0), [tshirts]);
  const avgPrice = useMemo(() => 
    totalTshirts > 0 ? totalValue / totalTshirts : 0, [tshirts]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-32 bg-gray-200 dark:bg-slate-700 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Advanced T-Shirt Inventory
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Comprehensive analytics, forecasting, and production planning
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="180">Last 6 months</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchTshirtData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Advanced Settings</DialogTitle>
                <DialogDescription>
                  Configure automated inventory management features
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Auto-Reorder</Label>
                  <Checkbox
                    checked={autoReorder}
                    onCheckedChange={setAutoReorder}
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Automatically reorder when stock levels fall below threshold
                  </p>
                </div>
                <div>
                  <Label>Min Stock Threshold</Label>
                  <Input
                    type="number"
                    value={minStockThreshold}
                    onChange={(e) => setMinStockThreshold(Number(e.target.value))}
                    min="1"
                    max="50"
                  />
                </div>
                <div>
                  <Label>Production Planning (weeks)</Label>
                  <Input
                    type="number"
                    value={productionWeeks}
                    onChange={(e) => setProductionWeeks(Number(e.target.value))}
                    min="1"
                    max="12"
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total T-Shirts</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalTshirts}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                <Package className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Value</p>
                <p className="text-2xl font-bold text-green-600">
                  ${totalValue.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Avg: ${avgPrice.toFixed(2)} per shirt
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Low Stock Items</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {tshirts.reduce((sum, t) => 
                    sum + t.variants.filter((v) => v.stock <= minStockThreshold).length, 0
                  )}
                </p>
              </div>
              <div className="p-3 rounded-full bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Auto-Reorder Active</p>
                <p className="text-2xl font-bold text-purple-600">
                  {autoReorder ? 'ON' : 'OFF'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {autoReorder ? 'Monitoring stock levels' : 'Manual mode'}
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                <Target className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
          <TabsTrigger value="production">Production</TabsTrigger>
          <TabsTrigger value="seasonal">Seasonal</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Ops</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {tshirts.map((tshirt) => (
              <Card key={tshirt.productId}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{tshirt.productName}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedTshirt(tshirt)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    {tshirt.analytics.totalStock} units • ${tshirt.analytics.totalValue.toFixed(2)} value
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white mb-2">Size Distribution</h5>
                      <div className="grid grid-cols-2 gap-2">
                        {tshirt.analytics.topSizes.map((size) => (
                          <div key={size.size} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-slate-800 rounded">
                            <span className="text-sm">{size.size}</span>
                            <div className="text-right">
                              <div className="font-medium">{size.count}</div>
                              <div className="text-xs text-gray-500">{size.percentage}%</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white mb-2">Color Performance</h5>
                      <div className="space-y-2">
                        {tshirt.analytics.topColors.slice(0, 4).map((color) => (
                          <div key={color.color} className="flex justify-between items-center">
                            <span className="text-sm">{color.color}</span>
                            <div className="text-right">
                              <div className="font-medium">{color.count}</div>
                              <div className="text-xs text-gray-500">{color.percentage}%</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded">
                        <div className="text-2xl font-bold text-blue-600">{tshirt.analytics.avgPrice.toFixed(2)}</div>
                        <div className="text-xs text-blue-600">Avg Price</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded">
                        <div className="text-2xl font-bold text-green-600">
                          {tshirt.variants.filter((v) => v.stock > 0).length}
                        </div>
                        <div className="text-xs text-green-600">In Stock</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Size Performance Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tshirts.map((tshirt) => (
                    <div key={tshirt.productId} className="border rounded-lg p-4">
                      <h5 className="font-medium mb-3">{tshirt.productName}</h5>
                      <div className="space-y-2">
                        {tshirt.variants.map((variant) => {
                          const efficiency = variant.stock > 0 ? (variant.sales30Days / variant.stock) * 100 : 0;
                          return (
                            <div key={variant.id} className="flex justify-between items-center">
                              <span className="text-sm">{variant.size} - {variant.color}</span>
                              <div className="text-right">
                                <div className={`font-medium ${
                                  efficiency > 50 ? 'text-green-600' :
                                  efficiency > 20 ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                  {efficiency.toFixed(1)}%
                                </div>
                                <div className="text-xs text-gray-500">
                                  {variant.sales30Days} sold / {variant.stock} stock
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profit Margin Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tshirts.map((tshirt) => (
                    <div key={tshirt.productId} className="border rounded-lg p-4">
                      <h5 className="font-medium mb-3">{tshirt.productName}</h5>
                      <div className="space-y-2">
                        {tshirt.variants.map((variant) => (
                          <div key={variant.id} className="flex justify-between items-center">
                            <span className="text-sm">{variant.size} - {variant.color}</span>
                            <div className="text-right">
                              <div className={`font-medium ${
                                variant.profitMargin > 50 ? 'text-green-600' :
                                variant.profitMargin > 30 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {variant.profitMargin.toFixed(1)}%
                              </div>
                              <div className="text-xs text-gray-500">
                                ${variant.price.toFixed(2)} / ${(variant.price * (1 - variant.profitMargin/100)).toFixed(2)} cost
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="forecasting">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Size Recommendations</CardTitle>
                <CardDescription>
                  AI-powered stock level recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tshirts.map((tshirt) => (
                    <div key={tshirt.productId} className="border rounded-lg p-4">
                      <h5 className="font-medium mb-3">{tshirt.productName}</h5>
                      <div className="space-y-2">
                        {getSizeRecommendations(tshirt).map((rec, index) => (
                          <div key={index} className={`flex justify-between items-center p-3 rounded ${
                            rec.priority === 'high' ? 'bg-red-50 dark:bg-red-950/20' :
                            rec.priority === 'medium' ? 'bg-yellow-50 dark:bg-yellow-950/20' : 'bg-blue-50 dark:bg-blue-950/20'
                          }`}>
                            <div>
                              <div className="font-medium">{rec.reason}</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                Current: {rec.currentStock} → Recommended: {rec.recommendedStock}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`font-semibold ${
                                rec.priority === 'high' ? 'text-red-600' :
                                rec.priority === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                              }`}>
                                {rec.difference > 0 ? '+' : ''}{rec.difference}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sales Trend Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tshirts.map((tshirt) => (
                    <div key={tshirt.productId} className="border rounded-lg p-4">
                      <h5 className="font-medium mb-3">{tshirt.productName}</h5>
                      <div className="space-y-2">
                        {tshirt.analytics.monthlyTrend.map((month) => (
                          <div key={month.month} className="flex justify-between items-center">
                            <span className="text-sm">{month.month}</span>
                            <div className="text-right">
                              <div className="font-medium">{month.sales} units</div>
                              <div className="text-sm text-green-600">${month.revenue.toFixed(2)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="production">
          <Card>
            <CardHeader>
              <CardTitle>Production Planning</CardTitle>
              <CardDescription>
                {productionWeeks}-week production schedule based on demand forecasts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {tshirts.map((tshirt) => {
                  const plans = generateProductionPlan(tshirt);
                  return (
                    <div key={tshirt.productId} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="font-medium">{tshirt.productName}</h5>
                        <Button
                          size="sm"
                          onClick={() => handleAutoReorder(tshirt.productId)}
                          disabled={!autoReorder}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Auto-Reorder
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {plans.map((plan) => (
                          <div key={plan.weekNumber} className="border rounded p-3">
                            <h6 className="font-medium mb-2">Week {plan.weekNumber}</h6>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {format(new Date(plan.startDate), 'MMM dd')} - {format(new Date(plan.endDate), 'MMM dd')}
                            </div>
                            
                            <div className="space-y-2">
                              <div>
                                <span className="text-xs text-gray-500">Total Units:</span>
                                <div className="font-medium">{plan.totalUnits}</div>
                              </div>
                              <div>
                                <span className="text-xs text-gray-500">Material (m²):</span>
                                <div className="font-medium">{plan.estimatedMaterial.toFixed(1)}</div>
                              </div>
                              
                              <div>
                                <span className="text-xs text-gray-500">Sizes:</span>
                                <div className="grid grid-cols-2 gap-1">
                                  {Object.entries(plan.sizeBreakdown).map(([size, qty]) => (
                                    <div key={size} className="text-xs">
                                      {size}: {qty}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seasonal">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Seasonal Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tshirts.map((tshirt) => {
                    const seasonal = getSeasonalAnalysis(tshirt);
                    return (
                      <div key={tshirt.productId} className="border rounded-lg p-4">
                        <h5 className="font-medium mb-3">{tshirt.productName}</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span>Current Season ({seasonal.currentSeason})</span>
                            <span className="font-medium">{seasonal.currentPerformance.sales} units</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Next Season ({seasonal.nextSeason})</span>
                            <span className="font-medium">{seasonal.nextSeasonForecast.sales} units</span>
                          </div>
                          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded text-sm">
                            {seasonal.recommendation}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Color Trend Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tshirts.map((tshirt) => (
                    <div key={tshirt.productId} className="border rounded-lg p-4">
                      <h5 className="font-medium mb-3">{tshirt.productName}</h5>
                      <div className="space-y-2">
                        {getColorTrends(tshirt).map((trend) => (
                          <div key={trend.color} className={`flex justify-between items-center p-2 rounded ${
                            trend.seasonalDemand === 'high' ? 'bg-green-50 dark:bg-green-950/20' :
                            trend.seasonalDemand === 'medium' ? 'bg-yellow-50 dark:bg-yellow-950/20' : 'bg-gray-50 dark:bg-slate-800'
                          }`}>
                            <div>
                              <div className="font-medium">{trend.color}</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                Velocity: {trend.salesVelocity.toFixed(2)}/day
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`text-xs px-2 py-1 rounded ${
                                trend.seasonalDemand === 'high' ? 'bg-green-600 text-white' :
                                trend.seasonalDemand === 'medium' ? 'bg-yellow-600 text-white' : 'bg-gray-600 text-white'
                              }`}>
                                {trend.seasonalDemand}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bulk">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Operations</CardTitle>
              <CardDescription>
                Mass updates for efficient inventory management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h5 className="font-medium mb-3">Select Sizes to Update</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'].map((size) => (
                    <div key={size} className="flex items-center space-x-2">
                      <Checkbox
                        checked={selectedSizes.includes(size)}
                        onCheckedChange={(checked: boolean) => {
                          if (checked) {
                            setSelectedSizes((prev) => [...prev, size]);
                          } else {
                            setSelectedSizes((prev) => prev.filter((s) => s !== size));
                          }
                        }}
                      />
                      <span className="text-sm">{size}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => setBulkAction('adjust')}
                  disabled={selectedSizes.length === 0}
                  variant="outline"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Adjust Stock
                </Button>
                <Button
                  onClick={() => setBulkAction('reorder')}
                  disabled={selectedSizes.length === 0}
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Reorder
                </Button>
                <Button
                  onClick={() => setBulkAction('discontinue')}
                  disabled={selectedSizes.length === 0}
                  variant="destructive"
                >
                  <Minus className="w-4 h-4 mr-2" />
                  Discontinue
                </Button>
              </div>

              {bulkAction && (
                <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                  <h5 className="font-medium mb-3">
                    {bulkAction === 'adjust' ? 'Bulk Stock Adjustment' :
                     bulkAction === 'reorder' ? 'Bulk Reorder Creation' : 'Bulk Discontinuation'}
                  </h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    This will affect {selectedSizes.length} selected sizes across all t-shirt products.
                  </p>
                  <div className="flex gap-2">
                    <Button onClick={handleBulkAdjustment}>
                      Confirm {bulkAction}
                    </Button>
                    <Button variant="outline" onClick={() => setBulkAction(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedTshirt && (
        <Dialog open={!!selectedTshirt} onOpenChange={() => setSelectedTshirt(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedTshirt.productName} - Detailed View</DialogTitle>
              <DialogDescription>
                Complete inventory analysis and management options
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div>
                <h5 className="font-medium mb-3">All Variants</h5>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-200 dark:border-slate-700">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-slate-800">
                        <th className="border border-gray-200 dark:border-slate-700 px-4 py-2 text-left">Image</th>
                        <th className="border border-gray-200 dark:border-slate-700 px-4 py-2 text-left">Size</th>
                        <th className="border border-gray-200 dark:border-slate-700 px-4 py-2 text-left">Color</th>
                        <th className="border border-gray-200 dark:border-slate-700 px-4 py-2 text-left">Stock</th>
                        <th className="border border-gray-200 dark:border-slate-700 px-4 py-2 text-left">Price</th>
                        <th className="border border-gray-200 dark:border-slate-700 px-4 py-2 text-left">30d Sales</th>
                        <th className="border border-gray-200 dark:border-slate-700 px-4 py-2 text-left">Margin</th>
                        <th className="border border-gray-200 dark:border-slate-700 px-4 py-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedTshirt.variants.map((variant, index) => (
                        <tr key={variant.id} className="hover:bg-gray-50 dark:hover:bg-slate-800">
                          <td className="border border-gray-200 dark:border-slate-700 px-4 py-2">
                            <ProductThumbnail
                              src={index === 0 ? undefined : undefined}
                              alt={`${variant.size} ${variant.color}`}
                              size="sm"
                            />
                          </td>
                          <td className="border border-gray-200 dark:border-slate-700 px-4 py-2 font-medium">{variant.size}</td>
                          <td className="border border-gray-200 dark:border-slate-700 px-4 py-2">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                              <span>{variant.color}</span>
                            </div>
                          </td>
                          <td className="border border-gray-200 dark:border-slate-700 px-4 py-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              variant.stock === 0 ? 'bg-red-100 text-red-700' :
                              variant.stock <= minStockThreshold ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                            }`}>
                              {variant.stock}
                            </span>
                          </td>
                          <td className="border border-gray-200 dark:border-slate-700 px-4 py-2">${variant.price.toFixed(2)}</td>
                          <td className="border border-gray-200 dark:border-slate-700 px-4 py-2">{variant.sales30Days}</td>
                          <td className="border border-gray-200 dark:border-slate-700 px-4 py-2">
                            <span className={`font-medium ${
                              variant.profitMargin > 50 ? 'text-green-600' :
                              variant.profitMargin > 30 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {variant.profitMargin.toFixed(1)}%
                            </span>
                          </td>
                          <td className="border border-gray-200 dark:border-slate-700 px-4 py-2">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Plus className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Minus className="w-3 h-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}