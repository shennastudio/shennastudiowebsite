'use client';

import {
 LineChart,
 Line,
 XAxis,
 YAxis,
 CartesianGrid,
 Tooltip,
 ResponsiveContainer,
 Legend,
} from'recharts';
import { format } from'date-fns';

interface SalesChartProps {
 data: {
 date: string;
 revenue: number;
 orders: number;
 }[];
}

export default function SalesChart({ data }: SalesChartProps) {
 const formattedData = data.map((item) => ({
 ...item,
 date: format(new Date(item.date),'MMM dd'),
 }));

 return (
 <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
 <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
 <ResponsiveContainer width="100%" height={300}>
 <LineChart data={formattedData}>
 <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
 <XAxis
 dataKey="date"
 className="text-gray-600"
 tick={{ fill:'currentColor' }}
 stroke="currentColor"
 style={{ fontSize:'12px' }}
 />
 <YAxis
 className="text-gray-600"
 tick={{ fill:'currentColor' }}
 stroke="currentColor"
 style={{ fontSize:'12px' }}
 tickFormatter={(value) => `$${value}`}
 />
 <Tooltip
 contentStyle={{
 backgroundColor:'var(--tooltip-bg, #fff)',
 border:'1px solid var(--tooltip-border, #e5e7eb)',
 borderRadius:'8px',
 color:'var(--tooltip-text, #111827)',
 }}
 wrapperClassName=""
 formatter={(value: number | string | undefined, name: string | undefined) => {
 if (value === undefined) return ['$0.00', name ||'Unknown'];
 const numValue = typeof value ==='number' ? value : parseFloat(value as string);
 if (name ==='revenue') {
 return [`$${numValue.toFixed(2)}`,'Revenue'];
 }
 return [numValue,'Orders'];
 }}
 />
 <Legend wrapperStyle={{ color:'inherit' }} />
 <Line
 type="monotone"
 dataKey="revenue"
 stroke="#0d9488"
 strokeWidth={2}
 dot={{ fill:'#0d9488', strokeWidth: 2, r: 4 }}
 activeDot={{ r: 6 }}
 name="Revenue"
 />
 <Line
 type="monotone"
 dataKey="orders"
 stroke="#06b6d4"
 strokeWidth={2}
 dot={{ fill:'#06b6d4', strokeWidth: 2, r: 4 }}
 activeDot={{ r: 6 }}
 name="Orders"
 />
 </LineChart>
 </ResponsiveContainer>
 </div>
 );
}
