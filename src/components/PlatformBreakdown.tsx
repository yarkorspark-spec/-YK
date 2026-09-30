import React from 'react';
import { DailySalesRecord, PlatformType } from '../types';
import { Store, Percent, ArrowUpRight, TrendingUp, CheckCircle, ChevronRight } from 'lucide-react';

interface PlatformBreakdownProps {
  records: DailySalesRecord[];
  activePlatform: PlatformType;
  onSelectPlatform: (p: PlatformType) => void;
}

interface PlatformMetric {
  id: 'tiktok' | 'shopee' | 'direct';
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  revenue: number;
  netProfit: number;
  adSpend: number;
  orders: number;
  marginPercent: number;
  roas: number;
  takeRateFee: string;
}

export const PlatformBreakdown: React.FC<PlatformBreakdownProps> = ({
  records,
  activePlatform,
  onSelectPlatform,
}) => {
  const platformTotals: Record<'tiktok' | 'shopee' | 'direct', {
    revenue: number;
    netProfit: number;
    adSpend: number;
    orders: number;
  }> = {
    tiktok: { revenue: 0, netProfit: 0, adSpend: 0, orders: 0 },
    shopee: { revenue: 0, netProfit: 0, adSpend: 0, orders: 0 },
    direct: { revenue: 0, netProfit: 0, adSpend: 0, orders: 0 },
  };

  records.forEach((r) => {
    (['tiktok', 'shopee', 'direct'] as const).forEach((key) => {
      platformTotals[key].revenue += r.platforms[key].revenue;
      platformTotals[key].netProfit += r.platforms[key].netProfit;
      platformTotals[key].adSpend += r.platforms[key].adSpend;
      platformTotals[key].orders += r.platforms[key].orders;
    });
  });

  const totalRev = Object.values(platformTotals).reduce((a, b) => a + b.revenue, 0);

  const platforms: PlatformMetric[] = [
    {
      id: 'tiktok',
      name: 'TikTok Shop',
      icon: '🎵',
      color: 'text-slate-900',
      bgColor: 'bg-slate-50',
      borderColor: 'border-slate-300',
      revenue: platformTotals.tiktok.revenue,
      netProfit: platformTotals.tiktok.netProfit,
      adSpend: platformTotals.tiktok.adSpend,
      orders: platformTotals.tiktok.orders,
      marginPercent: platformTotals.tiktok.revenue > 0 ? Number(((platformTotals.tiktok.netProfit / platformTotals.tiktok.revenue) * 100).toFixed(2)) : 0,
      roas: platformTotals.tiktok.adSpend > 0 ? Number((platformTotals.tiktok.revenue / platformTotals.tiktok.adSpend).toFixed(2)) : 0,
      takeRateFee: '~10-14% (ค่าธรรมเนียม + ค่าคอมแอฟฟิลิเอต)',
    },
    {
      id: 'shopee',
      name: 'Shopee',
      icon: '🛍️',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50/50',
      borderColor: 'border-orange-200',
      revenue: platformTotals.shopee.revenue,
      netProfit: platformTotals.shopee.netProfit,
      adSpend: platformTotals.shopee.adSpend,
      orders: platformTotals.shopee.orders,
      marginPercent: platformTotals.shopee.revenue > 0 ? Number(((platformTotals.shopee.netProfit / platformTotals.shopee.revenue) * 100).toFixed(2)) : 0,
      roas: platformTotals.shopee.adSpend > 0 ? Number((platformTotals.shopee.revenue / platformTotals.shopee.adSpend).toFixed(2)) : 0,
      takeRateFee: '~9-12% (ค่าคอมมิชชั่น & โค้ดส่งฟรี)',
    },
    {
      id: 'direct',
      name: 'เพจตรง / Line OA (B2B)',
      icon: '💬',
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50/50',
      borderColor: 'border-emerald-200',
      revenue: platformTotals.direct.revenue,
      netProfit: platformTotals.direct.netProfit,
      adSpend: platformTotals.direct.adSpend,
      orders: platformTotals.direct.orders,
      marginPercent: platformTotals.direct.revenue > 0 ? Number(((platformTotals.direct.netProfit / platformTotals.direct.revenue) * 100).toFixed(2)) : 0,
      roas: platformTotals.direct.adSpend > 0 ? Number((platformTotals.direct.revenue / platformTotals.direct.adSpend).toFixed(2)) : 0,
      takeRateFee: '0-3% (ประหยัดค่าธรรมเนียมแพลตฟอร์มสูงสุด)',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-2xs space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>สัดส่วนและประสิทธิภาพตามแพลตฟอร์ม</span>
          </h3>
          <p className="text-xs text-slate-500">
            คลิกที่การ์ดเพื่อกรองดูข้อมูลเฉพาะแพลตฟอร์ม หรือดูสัดส่วนเปรียบเทียบ
          </p>
        </div>

        {activePlatform !== 'all' && (
          <button
            onClick={() => onSelectPlatform('all')}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200 transition-colors self-start"
          >
            ✕ ล้างตัวกรองแพลตฟอร์ม (ดูทั้งหมด)
          </button>
        )}
      </div>

      {/* Share of Revenue Stack Bar */}
      <div className="space-y-1.5">
        <div className="text-xs font-semibold text-slate-600 flex justify-between">
          <span>สัดส่วนส่วนแบ่งยอดขาย (Market Share)</span>
          <span className="text-slate-400">100% รวมทุกช่องทาง</span>
        </div>
        <div className="h-3.5 w-full rounded-full bg-slate-100 overflow-hidden flex shadow-inner">
          {platforms.map((p) => {
            const pct = totalRev > 0 ? (p.revenue / totalRev) * 100 : 33.3;
            return (
              <div
                key={p.id}
                style={{ width: `${pct}%` }}
                className={`transition-all duration-300 ${
                  p.id === 'tiktok' ? 'bg-slate-800' :
                  p.id === 'shopee' ? 'bg-orange-500' : 'bg-emerald-500'
                }`}
                title={`${p.name}: ${pct.toFixed(1)}%`}
              />
            );
          })}
        </div>
      </div>

      {/* Grid of Platforms (TikTok, Shopee, เพจตรง/Line OA) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {platforms.map((p) => {
          const isSelected = activePlatform === p.id;
          const sharePct = totalRev > 0 ? ((p.revenue / totalRev) * 100).toFixed(1) : '0';

          return (
            <div
              key={p.id}
              onClick={() => onSelectPlatform(isSelected ? 'all' : p.id)}
              className={`rounded-xl p-4 border transition-all cursor-pointer relative ${
                isSelected
                  ? 'border-rose-600 ring-2 ring-rose-500/20 bg-rose-50/20 shadow-md'
                  : `${p.borderColor} ${p.bgColor} hover:shadow-md hover:border-slate-400`
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{p.icon}</span>
                  <span className="font-bold text-slate-900 text-sm">{p.name}</span>
                </div>
                <span className="text-xs font-semibold bg-white/90 border border-slate-200 px-1.5 py-0.5 rounded text-slate-700">
                  {sharePct}%
                </span>
              </div>

              {/* Revenue & Profit */}
              <div className="space-y-1.5 py-1">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-slate-500">ยอดขาย:</span>
                  <span className="font-extrabold text-slate-900 text-sm">
                    ฿{p.revenue.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-slate-500">กำไรสุทธิ:</span>
                  <span className="font-bold text-emerald-600">
                    ฿{p.netProfit.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-slate-500">% กำไร:</span>
                  <span className="font-bold text-amber-600">
                    {p.marginPercent}%
                  </span>
                </div>
                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-slate-500">ROAS แอด:</span>
                  <span className="font-semibold text-purple-700">
                    {p.roas}x
                  </span>
                </div>
              </div>

              {/* Tag / Insight */}
              <div className="mt-3 pt-2.5 border-t border-slate-200/60 text-[11px] text-slate-500 flex items-center justify-between">
                <span className="truncate">{p.takeRateFee}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
