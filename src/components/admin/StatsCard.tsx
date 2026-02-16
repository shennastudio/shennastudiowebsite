import { LucideIcon } from'lucide-react';

interface StatsCardProps {
 title: string;
 value: string | number;
 change?: {
 value: number;
 trend:'up' |'down';
 };
 icon: LucideIcon;
 iconColor?: string;
}

export default function StatsCard({
 title,
 value,
 change,
 icon: Icon,
 iconColor ='text-teal-600',
}: StatsCardProps) {
 return (
 <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
 <div className="flex items-center justify-between">
 <div className="flex-1">
 <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
 <p className="text-2xl font-bold text-gray-900">{value}</p>
 {change && (
 <div className="flex items-center mt-2">
 <span
 className={`text-sm font-medium ${
 change.trend ==='up' ?'text-green-600' :'text-red-600'
 }`}
 >
 {change.trend ==='up' ?'↑' :'↓'} {Math.abs(change.value)}%
 </span>
 <span className="text-xs text-gray-500 ml-2">vs last period</span>
 </div>
 )}
 </div>
 <div className={`p-3 rounded-full bg-gray-50 ${iconColor}`}>
 <Icon className="w-6 h-6" />
 </div>
 </div>
 </div>
 );
}
