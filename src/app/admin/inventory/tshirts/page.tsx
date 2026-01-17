'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Package,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Edit,
  Search,
  Download,
  RefreshCw,
  FileText,
  FileSpreadsheet,
  Sparkles,
  Target,
  Activity,
  Clock,
  BarChart3,
  PieChart,
  Calendar,
  Truck,
  Eye,
  Plus
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

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
  fresh: number;
  moderate: number;
  aging: number;
  stale: number;
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

export default function TShirtInventoryPage() {
  const router = useRouter();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [tshirts, setTshirts] = useState<TShirtData[]>([]);
  const [selectedTshirt, setSelectedTshirt] = useState<TShirtData | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [adjustmentType, setAdjustmentType] = useState<'RESTOCK' | 'ADJUSTMENT'>('RESTOCK');
  const [adjustmentQty, setAdjustmentQty] = useState(0);
  const [adjustmentReason, setAdjustmentReason] = useState('');
  const [selectedVariants, setSelectedVariants] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'stock' | 'price' | 'name'>('stock');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel'>('pdf');
  const [dateRange, setDateRange] = useState('30');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const REFRESH_INTERVAL = 20000;

  const fetchTshirtData = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setIsRefreshing(true);
      const response = await fetch(`/api/admin/tshirts-inventory?range=${dateRange}`);

      if (!response.ok) throw new Error('Failed to fetch t-shirt data');

      const data = await response.json();
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

  useEffect(() => {
    fetchTshirtData();
  }, [fetchTshirtData]);

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

  function computeHealthScore(tshirt: TShirtData): InventoryHealthScore {
    const variants = tshirt.variants;
    if (!variants.length) {
      return { overall: 0, sellThroughRate: 0, daysOfInventory: 0, stockVolatility: 0, returnRate: 0, status: 'critical', recommendations: ['No inventory data'] };
    }

    const totalSales = variants.reduce((sum, v) => sum + v.sales30Days, 0);
    const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);
    const sellThroughRate = totalStock + totalSales > 0 ? (totalSales / (totalStock + totalSales)) * 100 : 0;
    const avgDailySales = totalSales / 30;
    const daysOfInventory = avgDailySales > 0 ? totalStock / avgDailySales : 999;
    const avgStock = totalStock / variants.length;
    const variance = variants.reduce((sum, v) => sum + Math.pow(v.stock - avgStock, 2), 0) / variants.length;
    const stockVolatility = Math.sqrt(variance) / (avgStock || 1) * 100;
    const returnRate = variants.reduce((sum, v) => sum + (v.returnRate || 0), 0) / variants.length;

    let score = 50;
    if (sellThroughRate >= 20 && sellThroughRate <= 60) score += 20;
    else if (sellThroughRate >= 10 && sellThroughRate <= 70) score += 10;
    else score -= 10;

    if (daysOfInventory >= 14 && daysOfInventory <= 60) score += 30;
    else if (daysOfInventory >= 7 && daysOfInventory <= 90) score += 15;
    else score -= 15;

    if (stockVolatility < 30) score += 15;
    else if (stockVolatility < 50) score += 5;
    else score -= 10;

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
      const days = lastActivity ? Math.floor((now.getTime() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24)) : 90;
      totalDays += days;

      if (days < 30) fresh += v.stock;
      else if (days < 60) moderate += v.stock;
      else if (days < 90) aging += v.stock;
      else stale += v.stock;
    });

    return { fresh, moderate, aging, stale, avgDaysInStock: Math.round(totalDays / Math.max(1, tshirt.variants.length)) };
  }

  const totalTshirts = useMemo(() => tshirts.reduce((sum, t) => sum + (t.analytics?.totalStock || 0), 0), [tshirts]);
  const totalValue = useMemo(() => tshirts.reduce((sum, t) => sum + (t.analytics?.totalValue || 0), 0), [tshirts]);
  const avgPrice = useMemo(() => totalTshirts > 0 ? totalValue / totalTshirts : 0, [totalTshirts, totalValue]);
  const avgHealthScore = useMemo(() => {
    if (!tshirts.length) return 0;
    return Math.round(tshirts.reduce((sum, t) => sum + (t.healthScore?.overall || 0), 0) / tshirts.length);
  }, [tshirts]);
  const lowStockCount = useMemo(() => tshirts.reduce((sum, t) => sum + t.variants.filter(v => v.stock <= 10).length, 0), [tshirts]);
  const criticalItems = useMemo(() => tshirts.filter(t => t.healthScore?.status === 'critical').length, [tshirts]);

  const filteredTshirts = useMemo(() => {
    return tshirts.filter(tshirt => {
      const matchesSearch = !searchQuery ||
        tshirt.productName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [tshirts, searchQuery]);

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
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-purple-500" />
            T-Shirt Inventory
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Dedicated inventory management for all t-shirt products
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
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

          <Button onClick={() => router.push('/admin/inventory/tshirts/new')} variant="default" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add New T-Shirt
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/30 border-red-200 dark:border-red-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-red-600 dark:text-red-400">Critical</p>
                <p className="text-2xl font-bold text-red-900 dark:text-red-100">{criticalItems}</p>
              </div>
              <Target className="w-8 h-8 text-red-500 dark:text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-purple-600 dark:text-purple-400">Avg Price</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">${avgPrice.toFixed(2)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Products</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by name, SKU, or variant..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label>Filter</Label>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="low_stock">Low Stock</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Sort By</Label>
              <Select value={sortBy} onValueChange={(value: 'stock' | 'price' | 'name') => setSortBy(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stock">Stock</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Order</Label>
              <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">↑ Asc</SelectItem>
                  <SelectItem value="desc">↓ Desc</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 bg-gray-100 dark:bg-slate-800 p-1 rounded-lg">
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
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTshirts.map((tshirt) => (
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

                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-2 bg-blue-50 dark:bg-blue-950/30 rounded">
                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400">${(tshirt.analytics?.avgPrice || 0).toFixed(0)}</div>
                      <div className="text-xs text-blue-600 dark:text-blue-400">Avg Price</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 dark:bg-green-950/30 rounded">
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">{tshirt.variants.filter(v => v.stock > 0).length}</div>
                      <div className="text-xs text-green-600 dark:text-green-400">In Stock</div>
                    </div>
                    <div className="text-center p-2 bg-purple-50 dark:bg-purple-950/30 rounded">
                      <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{tshirt.healthScore?.daysOfInventory || 0}d</div>
                      <div className="text-xs text-purple-600 dark:text-purple-400">Supply</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="health">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTshirts.map((tshirt) => (
              <Card key={tshirt.productId} className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-gray-900 dark:text-white">
                    <span className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-red-500" />
                      {tshirt.productName}
                    </span>
                    <div className={`text-3xl font-bold ${getHealthScoreColor(tshirt.healthScore?.overall || 0).text}`}>
                      {getHealthStatus(tshirt.healthScore?.overall || 0).emoji} {tshirt.healthScore?.overall || 0}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <Package className="w-4 h-4" /> Sell-Through Rate
                      </div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">{tshirt.healthScore?.sellThroughRate || 0}%</div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <Clock className="w-4 h-4" /> Days of Inventory
                      </div>
                      <div className={`text-xl font-bold ${getAgingColor(tshirt.healthScore?.daysOfInventory || 0)}`}>{tshirt.healthScore?.daysOfInventory || 0} days</div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <Activity className="w-4 h-4" /> Stock Volatility
                      </div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">{tshirt.healthScore?.stockVolatility || 0}%</div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <TrendingUp className="w-4 h-4" /> Return Rate
                      </div>
                      <div className={`text-xl font-bold ${(tshirt.healthScore?.returnRate || 0) > 10 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>{tshirt.healthScore?.returnRate || 0}%</div>
                    </div>
                  </div>

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
                  {filteredTshirts.map((tshirt) => (
                    <div key={tshirt.productId} className="border border-gray-200 dark:border-slate-700 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 dark:text-white mb-3">{tshirt.productName}</h5>
                      <div className="space-y-2">
                        {tshirt.variants.slice(0, 5).map((variant) => {
                          const efficiency = variant.stock > 0 ? (variant.sales30Days / variant.stock) * 100 : 0;
                          return (
                            <div key={variant.id} className="flex justify-between items-center">
                              <span className="text-sm text-gray-700 dark:text-gray-300">{variant.size} - {variant.color}</span>
                              <div className="text-right">
                                <div className={`font-medium ${efficiency > 50 ? 'text-green-600 dark:text-green-400' : efficiency > 20 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>{efficiency.toFixed(1)}%</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{variant.sales30Days} sold / {variant.stock} stock</div>
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
                  {filteredTshirts.map((tshirt) => (
                    <div key={tshirt.productId} className="border border-gray-200 dark:border-slate-700 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 dark:text-white mb-3">{tshirt.productName}</h5>
                      <div className="space-y-2">
                        {tshirt.variants.slice(0, 5).map((variant) => (
                          <div key={variant.id} className="flex justify-between items-center">
                            <span className="text-sm text-gray-700 dark:text-gray-300">{variant.size} - {variant.color}</span>
                            <div className="text-right">
                              <div className={`font-medium ${variant.profitMargin > 50 ? 'text-green-600 dark:text-green-400' : variant.profitMargin > 30 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>{variant.profitMargin.toFixed(1)}%</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">${variant.price.toFixed(2)} / ${(variant.price * 0.6).toFixed(2)} cost</div>
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
            <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  AI Stock Recommendations
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">Smart reorder suggestions based on velocity and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredTshirts.map((tshirt) => (
                    <div key={tshirt.productId} className="border border-gray-200 dark:border-slate-700 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 dark:text-white mb-3">{tshirt.productName}</h5>
                      <div className="space-y-2">
                        {tshirt.variants.slice(0, 4).map((variant) => {
                          const salesVelocity = variant.sales30Days / 30;
                          const recommendedStock = Math.ceil(variant.reorderPoint + (salesVelocity * 14));
                          const difference = recommendedStock - variant.stock;
                          const priority = variant.stock === 0 ? 'high' : variant.stock <= 5 ? 'medium' : 'low';

                          return (
                            <div key={variant.id} className={`flex justify-between items-center p-3 rounded ${priority === 'high' ? 'bg-red-50 dark:bg-red-950/30' : priority === 'medium' ? 'bg-yellow-50 dark:bg-yellow-950/30' : 'bg-blue-50 dark:bg-blue-950/30'}`}>
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">{variant.size} - {variant.color}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Current: {variant.stock} → Recommended: {recommendedStock}</div>
                              </div>
                              <div className={`font-semibold ${priority === 'high' ? 'text-red-600 dark:text-red-400' : priority === 'medium' ? 'text-yellow-600 dark:text-yellow-400' : 'text-blue-600 dark:text-blue-400'}`}>{difference > 0 ? '+' : ''}{difference}</div>
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
                  {filteredTshirts.map((tshirt) => (
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
                      <p className="text-2xl font-bold text-teal-700 dark:text-teal-300">
                        {['Spring', 'Summer', 'Fall', 'Winter'][[2, 5, 8, 11].includes(new Date().getMonth()) ? [2, 5, 8, 11].indexOf(new Date().getMonth()) : 0]}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  {filteredTshirts.map((tshirt) => {
                    const seasonData = tshirt.analytics?.seasonPerformance || {};
                    return (
                      <div key={tshirt.productId} className="border border-gray-200 dark:border-slate-700 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 dark:text-white mb-3">{tshirt.productName}</h5>
                        <div className="space-y-2">
                          {Object.entries(seasonData).map(([season, data]) => (
                            <div key={season} className="flex justify-between items-center">
                              <span className="text-gray-700 dark:text-gray-300">{season}</span>
                              <span className="font-medium text-gray-900 dark:text-white">{data.sales} units</span>
                            </div>
                          ))}
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
                  {filteredTshirts.map((tshirt) => (
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
      </Tabs>

      {selectedTshirt && (
        <Dialog open={!!selectedTshirt} onOpenChange={() => setSelectedTshirt(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-white">{selectedTshirt.productName}</DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400">
                Detailed variant breakdown
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-gray-100 dark:bg-slate-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Stock</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedTshirt.analytics.totalStock}</p>
                </div>
                <div className="p-3 bg-gray-100 dark:bg-slate-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Value</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">${selectedTshirt.analytics.totalValue.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-gray-100 dark:bg-slate-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Avg Price</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">${selectedTshirt.analytics.avgPrice.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-gray-100 dark:bg-slate-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Variants</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{selectedTshirt.variants.length}</p>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100 dark:bg-slate-800">
                    <tr>
                      <th className="text-left p-3 text-sm font-medium text-gray-700 dark:text-gray-300">Size</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-700 dark:text-gray-300">Color</th>
                      <th className="text-right p-3 text-sm font-medium text-gray-700 dark:text-gray-300">Stock</th>
                      <th className="text-right p-3 text-sm font-medium text-gray-700 dark:text-gray-300">Price</th>
                      <th className="text-right p-3 text-sm font-medium text-gray-700 dark:text-gray-300">Sales (30d)</th>
                      <th className="text-right p-3 text-sm font-medium text-gray-700 dark:text-gray-300">Margin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedTshirt.variants.map((variant) => (
                      <tr key={variant.id} className="border-t dark:border-slate-700">
                        <td className="p-3 text-sm text-gray-900 dark:text-white">{variant.size}</td>
                        <td className="p-3 text-sm text-gray-900 dark:text-white">{variant.color}</td>
                        <td className={`p-3 text-sm text-right font-medium ${variant.stock === 0 ? 'text-red-600' : variant.stock <= 10 ? 'text-yellow-600' : 'text-green-600'}`}>{variant.stock}</td>
                        <td className="p-3 text-sm text-right text-gray-900 dark:text-white">${variant.price.toFixed(2)}</td>
                        <td className="p-3 text-sm text-right text-gray-900 dark:text-white">{variant.sales30Days}</td>
                        <td className="p-3 text-sm text-right text-gray-900 dark:text-white">{variant.profitMargin.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
