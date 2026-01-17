'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Clock,
  Activity,
  Zap,
  BarChart3,
  PieChart,
  Calendar,
  Truck,
  ShoppingBag,
  Heart,
  Sparkles
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ProductThumbnail } from '@/components/admin/ProductThumbnail';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface TShirtVariant {
  id: string;
  size: string;
  color: string;
  stock: number;
  price: number;
  cost: number;
  sales30Days: number;
  sales90Days: number;
  profitMargin: number;
  reorderPoint: number;
  safetyStock: number;
  supplier: string;
  lastRestock: string;
  lastSale: string;
  createdAt: string;
  returnRate: number;
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

interface InventoryHealthScore {
  overall: number;
  sellThroughRate: number;
  daysOfInventory: number;
  stockVolatility: number;
  returnRate: number;
  status: 'healthy' | 'watch' | 'critical';
  recommendations: string[];
}

interface StockAging {
  fresh: number; // < 30 days
  moderate: number; // 30-60 days
  aging: number; // 60-90 days
  stale: number; // > 90 days
  avgDaysInStock: number;
}

interface TShirtData {
  productName: string;
  productId: string;
  imageUrl?: string;
  variants: TShirtVariant[];
  analytics: TShirtAnalytics;
  healthScore: InventoryHealthScore;
  stockAging: StockAging;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getHealthScoreColor = (score: number) => {
  if (score >= 70) return { bg: 'bg-green-500', text: 'text-green-600 dark:text-green-400', light: 'bg-green-50 dark:bg-green-950/30' };
  if (score >= 40) return { bg: 'bg-yellow-500', text: 'text-yellow-600 dark:text-yellow-400', light: 'bg-yellow-50 dark:bg-yellow-950/30' };
  return { bg: 'bg-red-500', text: 'text-red-600 dark:text-red-400', light: 'bg-red-50 dark:bg-red-950/30' };
};

const getHealthStatus = (score: number): { label: string; emoji: string } => {
  if (score >= 70) return { label: 'Healthy', emoji: '🟢' };
  if (score >= 40) return { label: 'Watch', emoji: '🟡' };
  return { label: 'Critical', emoji: '🔴' };
};

const getAgingColor = (days: number) => {
  if (days < 30) return 'text-green-600 dark:text-green-400';
  if (days < 60) return 'text-yellow-600 dark:text-yellow-400';
  if (days < 90) return 'text-orange-600 dark:text-orange-400';
  return 'text-red-600 dark:text-red-400';
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AdvancedTShirtInventory() {
  // State
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

  // Real-time updates
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const REFRESH_INTERVAL = 20000;

  // ============================================================================
  // DATA FETCHING
  // ============================================================================

  const fetchTshirtData = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setIsRefreshing(true);
      const response = await fetch(`/api/admin/tshirts/enhanced?range=${dateRange}`);

      if (!response.ok) throw new Error('Failed to fetch t-shirt data');

      const data = await response.json();

      // Enhance data with computed health scores if not present
      const enhancedTshirts = (data.tshirts || []).map((tshirt: TShirtData) => ({
        ...tshirt,
        healthScore: tshirt.healthScore || computeHealthScore(tshirt),
        stockAging: tshirt.stockAging || computeStockAging(tshirt),
      }));

      setTshirts(enhancedTshirts);
      setLastRefresh(new Date());
    } catch (error) {
      if (!silent) toast.error('Failed to load t-shirt inventory');
      console.error(error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [dateRange]);

  // Initial fetch
  useEffect(() => {
    fetchTshirtData();
  }, [fetchTshirtData]);

  // Auto-refresh polling
  useEffect(() => {
    if (autoRefresh) {
      refreshIntervalRef.current = setInterval(() => {
        fetchTshirtData(true);
      }, REFRESH_INTERVAL);
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [autoRefresh, fetchTshirtData]);

  // ============================================================================
  // HEALTH SCORE COMPUTATION
  // ============================================================================

  function computeHealthScore(tshirt: TShirtData): InventoryHealthScore {
    const variants = tshirt.variants;
    if (!variants.length) {
      return { overall: 0, sellThroughRate: 0, daysOfInventory: 0, stockVolatility: 0, returnRate: 0, status: 'critical', recommendations: ['No inventory data'] };
    }

    // Sell-through rate (sales / (sales + current stock))
    const totalSales = variants.reduce((sum, v) => sum + v.sales30Days, 0);
    const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);
    const sellThroughRate = totalStock + totalSales > 0 ? (totalSales / (totalStock + totalSales)) * 100 : 0;

    // Days of inventory remaining
    const avgDailySales = totalSales / 30;
    const daysOfInventory = avgDailySales > 0 ? totalStock / avgDailySales : 999;

    // Stock volatility (variance in stock levels)
    const avgStock = totalStock / variants.length;
    const variance = variants.reduce((sum, v) => sum + Math.pow(v.stock - avgStock, 2), 0) / variants.length;
    const stockVolatility = Math.sqrt(variance) / (avgStock || 1) * 100;

    // Return rate
    const returnRate = variants.reduce((sum, v) => sum + (v.returnRate || 0), 0) / variants.length;

    // Calculate overall score (0-100)
    let score = 50;

    // Sell-through rate contribution (20 points max)
    if (sellThroughRate >= 20 && sellThroughRate <= 60) score += 20;
    else if (sellThroughRate >= 10 && sellThroughRate <= 70) score += 10;
    else score -= 10;

    // Days of inventory contribution (30 points max)
    if (daysOfInventory >= 14 && daysOfInventory <= 60) score += 30;
    else if (daysOfInventory >= 7 && daysOfInventory <= 90) score += 15;
    else score -= 15;

    // Stock volatility contribution (15 points max)
    if (stockVolatility < 30) score += 15;
    else if (stockVolatility < 50) score += 5;
    else score -= 10;

    // Return rate contribution (15 points max)
    if (returnRate < 5) score += 15;
    else if (returnRate < 10) score += 5;
    else score -= 10;

    score = Math.max(0, Math.min(100, score));

    const recommendations: string[] = [];
    if (daysOfInventory < 14) recommendations.push('Low inventory - consider restocking');
    if (daysOfInventory > 90) recommendations.push('High inventory - consider promotions');
    if (sellThroughRate < 10) recommendations.push('Slow moving - review pricing');
    if (returnRate > 10) recommendations.push('High returns - check quality');

    return {
      overall: Math.round(score),
      sellThroughRate: Math.round(sellThroughRate),
      daysOfInventory: Math.round(daysOfInventory),
      stockVolatility: Math.round(stockVolatility),
      returnRate: Math.round(returnRate),
      status: score >= 70 ? 'healthy' : score >= 40 ? 'watch' : 'critical',
      recommendations
    };
  }

  function computeStockAging(tshirt: TShirtData): StockAging {
    const now = new Date();
    let fresh = 0, moderate = 0, aging = 0, stale = 0;
    let totalDays = 0;

    tshirt.variants.forEach(v => {
      const lastActivity = v.lastSale || v.lastRestock || v.createdAt;
      const days = lastActivity ? differenceInDays(now, new Date(lastActivity)) : 90;
      totalDays += days;

      if (days < 30) fresh += v.stock;
      else if (days < 60) moderate += v.stock;
      else if (days < 90) aging += v.stock;
      else stale += v.stock;
    });

    return {
      fresh,
      moderate,
      aging,
      stale,
      avgDaysInStock: Math.round(totalDays / Math.max(1, tshirt.variants.length))
    };
  }

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const totalTshirts = useMemo(() =>
    tshirts.reduce((sum, t) => sum + (t.analytics?.totalStock || 0), 0), [tshirts]);

  const totalValue = useMemo(() =>
    tshirts.reduce((sum, t) => sum + (t.analytics?.totalValue || 0), 0), [tshirts]);

  const avgPrice = useMemo(() =>
    totalTshirts > 0 ? totalValue / totalTshirts : 0, [totalTshirts, totalValue]);

  const avgHealthScore = useMemo(() => {
    if (!tshirts.length) return 0;
    return Math.round(tshirts.reduce((sum, t) => sum + (t.healthScore?.overall || 0), 0) / tshirts.length);
  }, [tshirts]);

  const lowStockCount = useMemo(() =>
    tshirts.reduce((sum, t) =>
      sum + t.variants.filter(v => v.stock <= minStockThreshold).length, 0
    ), [tshirts, minStockThreshold]);

  const criticalItems = useMemo(() =>
    tshirts.filter(t => t.healthScore?.status === 'critical').length, [tshirts]);

  // ============================================================================
  // SEASONAL ANALYSIS
  // ============================================================================

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

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

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
    } catch {
      toast.error('Auto-reorder failed');
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

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
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-purple-500" />
            Advanced T-Shirt Inventory
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            AI-powered analytics, forecasting, and production planning
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Real-time indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-slate-800 rounded-lg text-xs sm:text-sm">
            <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <span className="text-gray-600 dark:text-gray-300">
              {autoRefresh ? 'Live' : 'Paused'}
            </span>
            <span className="text-gray-400 dark:text-gray-500 hidden sm:inline">
              · {lastRefresh.toLocaleTimeString()}
            </span>
          </div>

          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40 bg-white dark:bg-slate-800">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="180">Last 6 months</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={() => fetchTshirtData()} disabled={isRefreshing} variant="outline">
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button onClick={() => setAutoRefresh(!autoRefresh)} variant={autoRefresh ? 'default' : 'outline'} size="sm">
            {autoRefresh ? 'Pause' : 'Resume'}
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-slate-900">
              <DialogHeader>
                <DialogTitle className="text-gray-900 dark:text-white">Advanced Settings</DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400">
                  Configure automated inventory management features
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="autoReorder"
                    checked={autoReorder}
                    onCheckedChange={(checked) => setAutoReorder(checked as boolean)}
                  />
                  <div>
                    <Label htmlFor="autoReorder" className="text-gray-900 dark:text-white">Auto-Reorder</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Automatically reorder when stock falls below threshold
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-900 dark:text-white">Min Stock Threshold</Label>
                  <Input
                    type="number"
                    value={minStockThreshold}
                    onChange={(e) => setMinStockThreshold(Number(e.target.value))}
                    min="1"
                    max="50"
                    className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-900 dark:text-white">Production Planning (weeks)</Label>
                  <Input
                    type="number"
                    value={productionWeeks}
                    onChange={(e) => setProductionWeeks(Number(e.target.value))}
                    min="1"
                    max="12"
                    className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total T-Shirts */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400">Total Units</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{totalTshirts.toLocaleString()}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        {/* Total Value */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/30 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-green-600 dark:text-green-400">Total Value</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">${totalValue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        {/* Health Score */}
        <Card className={`bg-gradient-to-br ${getHealthScoreColor(avgHealthScore).light} border-current`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs font-medium ${getHealthScoreColor(avgHealthScore).text}`}>Health Score</p>
                <p className={`text-2xl font-bold ${getHealthScoreColor(avgHealthScore).text}`}>
                  {getHealthStatus(avgHealthScore).emoji} {avgHealthScore}
                </p>
              </div>
              <Activity className={`w-8 h-8 ${getHealthScoreColor(avgHealthScore).text}`} />
            </div>
          </CardContent>
        </Card>

        {/* Low Stock */}
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/50 dark:to-yellow-900/30 border-yellow-200 dark:border-yellow-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-yellow-600 dark:text-yellow-400">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{lowStockCount}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500 dark:text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        {/* Critical Items */}
        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/30 border-red-200 dark:border-red-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-red-600 dark:text-red-400">Critical</p>
                <p className="text-2xl font-bold text-red-900 dark:text-red-100">{criticalItems}</p>
              </div>
              <Zap className="w-8 h-8 text-red-500 dark:text-red-400" />
            </div>
          </CardContent>
        </Card>

        {/* Auto-Reorder Status */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-purple-600 dark:text-purple-400">Auto-Reorder</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{autoReorder ? 'ON' : 'OFF'}</p>
              </div>
              <Target className="w-8 h-8 text-purple-500 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 bg-gray-100 dark:bg-slate-800 p-1 rounded-lg">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 rounded">
            <Eye className="w-4 h-4 mr-2 hidden sm:block" />Overview
          </TabsTrigger>
          <TabsTrigger value="health" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 rounded">
            <Activity className="w-4 h-4 mr-2 hidden sm:block" />Health
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 rounded">
            <BarChart3 className="w-4 h-4 mr-2 hidden sm:block" />Analytics
          </TabsTrigger>
          <TabsTrigger value="forecasting" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 rounded">
            <TrendingUp className="w-4 h-4 mr-2 hidden sm:block" />Forecast
          </TabsTrigger>
          <TabsTrigger value="seasonal" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 rounded">
            <Calendar className="w-4 h-4 mr-2 hidden sm:block" />Seasonal
          </TabsTrigger>
          <TabsTrigger value="bulk" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 rounded">
            <Truck className="w-4 h-4 mr-2 hidden sm:block" />Bulk Ops
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {tshirts.map((tshirt) => (
              <Card key={tshirt.productId} className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center gap-2">
                        {tshirt.productName}
                        <Badge variant={tshirt.healthScore?.status === 'healthy' ? 'default' : tshirt.healthScore?.status === 'watch' ? 'secondary' : 'destructive'} className="ml-2">
                          {getHealthStatus(tshirt.healthScore?.overall || 0).emoji} {tshirt.healthScore?.overall || 0}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400">
                        {tshirt.analytics?.totalStock || 0} units · ${(tshirt.analytics?.totalValue || 0).toLocaleString()}
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedTshirt(tshirt)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Size Distribution */}
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <PieChart className="w-4 h-4" /> Size Distribution
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {(tshirt.analytics?.topSizes || []).slice(0, 5).map((size) => (
                        <div key={size.size} className="px-3 py-1.5 bg-gray-100 dark:bg-slate-700 rounded-lg text-sm">
                          <span className="font-medium text-gray-900 dark:text-white">{size.size}</span>
                          <span className="text-gray-500 dark:text-gray-400 ml-1">({size.count})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stock Aging Bar */}
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Stock Age
                    </h5>
                    <div className="h-3 rounded-full overflow-hidden flex bg-gray-200 dark:bg-slate-700">
                      {tshirt.stockAging && (
                        <>
                          <div className="bg-green-500 h-full transition-all" style={{ width: `${(tshirt.stockAging.fresh / Math.max(1, tshirt.analytics?.totalStock || 1)) * 100}%` }} title="Fresh (<30d)" />
                          <div className="bg-yellow-500 h-full transition-all" style={{ width: `${(tshirt.stockAging.moderate / Math.max(1, tshirt.analytics?.totalStock || 1)) * 100}%` }} title="Moderate (30-60d)" />
                          <div className="bg-orange-500 h-full transition-all" style={{ width: `${(tshirt.stockAging.aging / Math.max(1, tshirt.analytics?.totalStock || 1)) * 100}%` }} title="Aging (60-90d)" />
                          <div className="bg-red-500 h-full transition-all" style={{ width: `${(tshirt.stockAging.stale / Math.max(1, tshirt.analytics?.totalStock || 1)) * 100}%` }} title="Stale (>90d)" />
                        </>
                      )}
                    </div>
                    <div className="flex justify-between text-xs mt-1 text-gray-500 dark:text-gray-400">
                      <span>Fresh: {tshirt.stockAging?.fresh || 0}</span>
                      <span>Stale: {tshirt.stockAging?.stale || 0}</span>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-2 bg-blue-50 dark:bg-blue-950/30 rounded">
                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        ${(tshirt.analytics?.avgPrice || 0).toFixed(0)}
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-400">Avg Price</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 dark:bg-green-950/30 rounded">
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        {tshirt.variants.filter(v => v.stock > 0).length}
                      </div>
                      <div className="text-xs text-green-600 dark:text-green-400">In Stock</div>
                    </div>
                    <div className="text-center p-2 bg-purple-50 dark:bg-purple-950/30 rounded">
                      <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {tshirt.healthScore?.daysOfInventory || 0}d
                      </div>
                      <div className="text-xs text-purple-600 dark:text-purple-400">Supply</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Health Tab */}
        <TabsContent value="health">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Health Score Cards */}
            {tshirts.map((tshirt) => (
              <Card key={tshirt.productId} className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-gray-900 dark:text-white">
                    <span className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-red-500" />
                      {tshirt.productName}
                    </span>
                    <div className={`text-3xl font-bold ${getHealthScoreColor(tshirt.healthScore?.overall || 0).text}`}>
                      {getHealthStatus(tshirt.healthScore?.overall || 0).emoji} {tshirt.healthScore?.overall || 0}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Health Metrics */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <ShoppingBag className="w-4 h-4" /> Sell-Through Rate
                      </div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">
                        {tshirt.healthScore?.sellThroughRate || 0}%
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <Clock className="w-4 h-4" /> Days of Inventory
                      </div>
                      <div className={`text-xl font-bold ${getAgingColor(tshirt.healthScore?.daysOfInventory || 0)}`}>
                        {tshirt.healthScore?.daysOfInventory || 0} days
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <Activity className="w-4 h-4" /> Stock Volatility
                      </div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">
                        {tshirt.healthScore?.stockVolatility || 0}%
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <TrendingDown className="w-4 h-4" /> Return Rate
                      </div>
                      <div className={`text-xl font-bold ${(tshirt.healthScore?.returnRate || 0) > 10 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                        {tshirt.healthScore?.returnRate || 0}%
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  {tshirt.healthScore?.recommendations && tshirt.healthScore.recommendations.length > 0 && (
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                      <h5 className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" /> AI Recommendations
                      </h5>
                      <ul className="space-y-1">
                        {tshirt.healthScore.recommendations.map((rec, i) => (
                          <li key={i} className="text-sm text-amber-700 dark:text-amber-300 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  Size Performance Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tshirts.map((tshirt) => (
                    <div key={tshirt.productId} className="border border-gray-200 dark:border-slate-700 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 dark:text-white mb-3">{tshirt.productName}</h5>
                      <div className="space-y-2">
                        {tshirt.variants.slice(0, 5).map((variant) => {
                          const efficiency = variant.stock > 0 ? (variant.sales30Days / variant.stock) * 100 : 0;
                          return (
                            <div key={variant.id} className="flex justify-between items-center">
                              <span className="text-sm text-gray-700 dark:text-gray-300">{variant.size} - {variant.color}</span>
                              <div className="text-right">
                                <div className={`font-medium ${
                                  efficiency > 50 ? 'text-green-600 dark:text-green-400' :
                                  efficiency > 20 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                                }`}>
                                  {efficiency.toFixed(1)}%
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
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

            <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  Profit Margin Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tshirts.map((tshirt) => (
                    <div key={tshirt.productId} className="border border-gray-200 dark:border-slate-700 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 dark:text-white mb-3">{tshirt.productName}</h5>
                      <div className="space-y-2">
                        {tshirt.variants.slice(0, 5).map((variant) => (
                          <div key={variant.id} className="flex justify-between items-center">
                            <span className="text-sm text-gray-700 dark:text-gray-300">{variant.size} - {variant.color}</span>
                            <div className="text-right">
                              <div className={`font-medium ${
                                variant.profitMargin > 50 ? 'text-green-600 dark:text-green-400' :
                                variant.profitMargin > 30 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                              }`}>
                                {variant.profitMargin.toFixed(1)}%
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                ${variant.price.toFixed(2)} / ${(variant.cost || variant.price * 0.6).toFixed(2)} cost
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

        {/* Forecasting Tab */}
        <TabsContent value="forecasting">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  AI Stock Recommendations
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Smart reorder suggestions based on velocity and trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tshirts.map((tshirt) => (
                    <div key={tshirt.productId} className="border border-gray-200 dark:border-slate-700 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 dark:text-white mb-3">{tshirt.productName}</h5>
                      <div className="space-y-2">
                        {tshirt.variants.slice(0, 4).map((variant) => {
                          const salesVelocity = variant.sales30Days / 30;
                          const recommendedStock = Math.ceil(variant.reorderPoint + (salesVelocity * 14));
                          const difference = recommendedStock - variant.stock;
                          const priority = variant.stock === 0 ? 'high' : variant.stock <= minStockThreshold ? 'medium' : 'low';

                          return (
                            <div key={variant.id} className={`flex justify-between items-center p-3 rounded ${
                              priority === 'high' ? 'bg-red-50 dark:bg-red-950/30' :
                              priority === 'medium' ? 'bg-yellow-50 dark:bg-yellow-950/30' : 'bg-blue-50 dark:bg-blue-950/30'
                            }`}>
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">{variant.size} - {variant.color}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  Current: {variant.stock} → Recommended: {recommendedStock}
                                </div>
                              </div>
                              <div className={`font-semibold ${
                                priority === 'high' ? 'text-red-600 dark:text-red-400' :
                                priority === 'medium' ? 'text-yellow-600 dark:text-yellow-400' : 'text-blue-600 dark:text-blue-400'
                              }`}>
                                {difference > 0 ? '+' : ''}{difference}
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

            <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Sales Trend Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tshirts.map((tshirt) => (
                    <div key={tshirt.productId} className="border border-gray-200 dark:border-slate-700 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 dark:text-white mb-3">{tshirt.productName}</h5>
                      <div className="space-y-2">
                        {(tshirt.analytics?.monthlyTrend || []).slice(0, 4).map((month) => (
                          <div key={month.month} className="flex justify-between items-center">
                            <span className="text-sm text-gray-700 dark:text-gray-300">{month.month}</span>
                            <div className="text-right">
                              <div className="font-medium text-gray-900 dark:text-white">{month.sales} units</div>
                              <div className="text-sm text-green-600 dark:text-green-400">${month.revenue.toFixed(2)}</div>
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

        {/* Seasonal Tab */}
        <TabsContent value="seasonal">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-teal-500" />
                  Seasonal Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-teal-50 dark:bg-teal-950/30 rounded-lg mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-teal-600 dark:text-teal-400">Current Season</p>
                      <p className="text-2xl font-bold text-teal-700 dark:text-teal-300">{getCurrentSeason()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-teal-600 dark:text-teal-400">Next Season</p>
                      <p className="text-2xl font-bold text-teal-700 dark:text-teal-300">{getNextSeason(getCurrentSeason())}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  {tshirts.map((tshirt) => {
                    const currentSeason = getCurrentSeason();
                    const nextSeason = getNextSeason(currentSeason);
                    const seasonData = tshirt.analytics?.seasonPerformance || {};

                    return (
                      <div key={tshirt.productId} className="border border-gray-200 dark:border-slate-700 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 dark:text-white mb-3">{tshirt.productName}</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700 dark:text-gray-300">{currentSeason} (Current)</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {seasonData[currentSeason]?.sales || 0} units
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700 dark:text-gray-300">{nextSeason} (Forecast)</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {seasonData[nextSeason]?.sales || 0} units
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-pink-500" />
                  Color Trend Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tshirts.map((tshirt) => (
                    <div key={tshirt.productId} className="border border-gray-200 dark:border-slate-700 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 dark:text-white mb-3">{tshirt.productName}</h5>
                      <div className="space-y-2">
                        {(tshirt.analytics?.topColors || []).slice(0, 4).map((color) => (
                          <div key={color.color} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-slate-700/50 rounded">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-gray-400 to-gray-600" />
                              <span className="font-medium text-gray-900 dark:text-white">{color.color}</span>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-gray-900 dark:text-white">{color.count}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{color.percentage}%</div>
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

        {/* Bulk Operations Tab */}
        <TabsContent value="bulk">
          <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-indigo-500" />
                Bulk Operations
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Mass updates for efficient inventory management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white mb-3">Select Sizes to Update</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'].map((size) => (
                    <div key={size} className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedSizes.includes(size)
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30'
                        : 'border-gray-200 dark:border-slate-700 hover:border-indigo-300'
                    }`} onClick={() => {
                      if (selectedSizes.includes(size)) {
                        setSelectedSizes(prev => prev.filter(s => s !== size));
                      } else {
                        setSelectedSizes(prev => [...prev, size]);
                      }
                    }}>
                      <Checkbox checked={selectedSizes.includes(size)} className="mr-2" />
                      <span className="font-medium text-gray-900 dark:text-white">{size}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => setBulkAction('adjust')}
                  disabled={selectedSizes.length === 0}
                  variant="outline"
                  className="h-16"
                >
                  <Edit className="w-5 h-5 mr-2" />
                  Adjust Stock
                </Button>
                <Button
                  onClick={() => setBulkAction('reorder')}
                  disabled={selectedSizes.length === 0}
                  variant="outline"
                  className="h-16"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Reorder
                </Button>
                <Button
                  onClick={() => setBulkAction('discontinue')}
                  disabled={selectedSizes.length === 0}
                  variant="destructive"
                  className="h-16"
                >
                  <Minus className="w-5 h-5 mr-2" />
                  Discontinue
                </Button>
              </div>

              {bulkAction && (
                <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                  <h5 className="font-medium text-gray-900 dark:text-white mb-3">
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

      {/* Detail Dialog */}
      {selectedTshirt && (
        <Dialog open={!!selectedTshirt} onOpenChange={() => setSelectedTshirt(null)}>
          <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto bg-white dark:bg-slate-900">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-white flex items-center gap-3">
                {selectedTshirt.productName}
                <Badge variant={selectedTshirt.healthScore?.status === 'healthy' ? 'default' : selectedTshirt.healthScore?.status === 'watch' ? 'secondary' : 'destructive'}>
                  {getHealthStatus(selectedTshirt.healthScore?.overall || 0).emoji} Health: {selectedTshirt.healthScore?.overall || 0}
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400">
                Complete inventory analysis and variant management
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {selectedTshirt.analytics?.totalStock || 0}
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">Total Stock</div>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ${(selectedTshirt.analytics?.totalValue || 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">Total Value</div>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {selectedTshirt.healthScore?.daysOfInventory || 0}d
                  </div>
                  <div className="text-sm text-purple-600 dark:text-purple-400">Days Supply</div>
                </div>
                <div className="p-4 bg-teal-50 dark:bg-teal-950/30 rounded-lg text-center">
                  <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                    {selectedTshirt.healthScore?.sellThroughRate || 0}%
                  </div>
                  <div className="text-sm text-teal-600 dark:text-teal-400">Sell-Through</div>
                </div>
              </div>

              {/* Variants Table */}
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white mb-3">All Variants</h5>
                <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-slate-700">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-slate-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Size</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Color</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stock</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">30d Sales</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Margin</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                      {selectedTshirt.variants.map((variant) => (
                        <tr key={variant.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50">
                          <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{variant.size}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full bg-gray-400" />
                              <span className="text-gray-700 dark:text-gray-300">{variant.color}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              variant.stock === 0 ? 'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300' :
                              variant.stock <= minStockThreshold ? 'bg-yellow-100 dark:bg-yellow-950/50 text-yellow-700 dark:text-yellow-300' :
                              'bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-300'
                            }`}>
                              {variant.stock}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-700 dark:text-gray-300">${variant.price.toFixed(2)}</td>
                          <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{variant.sales30Days}</td>
                          <td className="px-4 py-3">
                            <span className={`font-medium ${
                              variant.profitMargin > 50 ? 'text-green-600 dark:text-green-400' :
                              variant.profitMargin > 30 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                            }`}>
                              {variant.profitMargin.toFixed(1)}%
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost"><Edit className="w-3 h-3" /></Button>
                              <Button size="sm" variant="ghost"><Plus className="w-3 h-3" /></Button>
                              <Button size="sm" variant="ghost"><Minus className="w-3 h-3" /></Button>
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
