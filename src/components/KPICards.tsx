import React from 'react';
import { 
  TrendingUp, 
  Coins, 
  Percent, 
  Megaphone, 
  Target, 
  Award,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { DailySalesRecord, CategoryType, PlatformType } from '../types';

interface KPICardsProps {
  records: DailySalesRecord[];
  category: CategoryType;
  platform: PlatformType;
}

export const KPICards: React.FC<KPICardsProps> = ({ records, category, platform }) => {
  // Compute totals based on category and platform filters
  let totalRevenue = 0;
  let totalNetProfit = 0;
  let totalAdSpend = 0;
  let totalOrders = 0;

  records.forEach((r) => {
    if (category === 'all' && platform === 'all') {
      totalRevenue += r.totalRevenue;
      totalNetProfit += r.totalNetProfit;
      totalAdSpend += r.totalAdSpend;
      totalOrders += r.chili.orders + r.machine.orders;
    } else if (category === 'chili' && platform === 'all') {
      totalRevenue += r.chili.revenue;
      totalNetProfit += r.chili.netProfit;
      totalAdSpend += r.chili.adSpend;
      totalOrders += r.chili.orders;
    } else if (category === 'machine' && platform === 'all') {
      totalRevenue += r.machine.revenue;
      totalNetProfit += r.machine.netProfit;
      totalAdSpend += r.machine.adSpend;
      totalOrders += r.machine.orders;
    } else if (platform !== 'all') {
      const pData = r.platforms[platform];
      // If category also filtered, adjust proportionally
      const catRatio = category === 'chili' ? 0.65 : category === 'machine' ? 0.35 : 1.0;
      totalRevenue += Math.round(pData.revenue * catRatio);
      totalNetProfit += Math.round(pData.netProfit * catRatio);
      totalAdSpend += Math.round(pData.adSpend * catRatio);
      totalOrders += Math.round(pData.orders * catRatio);
    }
  });

  const avgMargin = totalRevenue > 0 ? ((totalNetProfit / totalRevenue) * 100).toFixed(2) : '0.00';
  const roas = totalAdSpend > 0 ? (totalRevenue / totalAdSpend).toFixed(2) : '0.00';
  const profitPerOrder = totalOrders > 0 ? Math.round(totalNetProfit / totalOrders) : 0;

  const categoryTitle = 
    category === 'all' ? 'ภาพรวมรวมทุกสินค้า' :
    category === 'chili' ? 'หมวดหมู่น้ำพริก' : 'หมวดหมู่เครื่องจักร';

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      
      {/* 1. ยอดขายรวม */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-shadow relative overflow-hidden">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs sm:text-sm font-medium">ยอดขายรวม</span>
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          ฿{totalRevenue.toLocaleString()}
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
          <span className="font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
            {totalOrders.toLocaleString()} ออเดอร์
          </span>
          <span className="truncate">{categoryTitle}</span>
        </div>
      </div>

      {/* 2. กำไรสุทธิรวม */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-100 bg-linear-to-b from-white to-emerald-50/30 shadow-2xs hover:shadow-md transition-shadow relative overflow-hidden">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs sm:text-sm font-medium text-emerald-900">กำไรสุทธิรวม</span>
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Coins className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-emerald-700 tracking-tight">
          ฿{totalNetProfit.toLocaleString()}
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-700">
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span>เฉลี่ย ฿{profitPerOrder.toLocaleString()} / ออเดอร์</span>
        </div>
      </div>

      {/* 3. % อัตรากำไรสุทธิเฉลี่ย (Profit Margin %) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-shadow relative overflow-hidden">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs sm:text-sm font-medium">อัตรากำไรสุทธิ</span>
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Percent className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          {avgMargin}%
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs">
          <span className={`font-semibold px-1.5 py-0.5 rounded ${
            Number(avgMargin) >= 15 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
          }`}>
            {Number(avgMargin) >= 15 ? 'สุขภาพกำไรดีมาก' : 'ควรเฝ้าระวังมาร์จิ้น'}
          </span>
          <span className="text-slate-400">เป้าหมาย ≥ 15%</span>
        </div>
      </div>

      {/* 4. งบโฆษณา & ROAS (การตลาด) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-shadow relative overflow-hidden">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs sm:text-sm font-medium">ประสิทธิภาพแอด (ROAS)</span>
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Target className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl sm:text-2xl font-extrabold text-purple-700 tracking-tight">
            {roas}x
          </span>
          <span className="text-xs text-slate-400 font-medium">
            (งบ ฿{totalAdSpend.toLocaleString()})
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
          <span className="text-purple-600 font-semibold">1 บาท แลกได้ {roas} บาท</span>
        </div>
      </div>

    </div>
  );
};
