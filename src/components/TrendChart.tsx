import React, { useState } from 'react';
import { DailySalesRecord, CategoryType, PlatformType } from '../types';
import { TrendingUp, Sparkles, AlertCircle, Info } from 'lucide-react';

interface TrendChartProps {
  records: DailySalesRecord[];
  category: CategoryType;
  platform: PlatformType;
}

export const TrendChart: React.FC<TrendChartProps> = ({ records, category, platform }) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Extract points for display
  const points = records.map((r, i) => {
    let rev = r.totalRevenue;
    let profit = r.totalNetProfit;
    let margin = r.marginPercent;

    if (category === 'chili' && platform === 'all') {
      rev = r.chili.revenue;
      profit = r.chili.netProfit;
      margin = r.chili.marginPercent;
    } else if (category === 'machine' && platform === 'all') {
      rev = r.machine.revenue;
      profit = r.machine.netProfit;
      margin = r.machine.marginPercent;
    } else if (platform !== 'all') {
      const p = r.platforms[platform];
      const catRatio = category === 'chili' ? 0.65 : category === 'machine' ? 0.35 : 1.0;
      rev = Math.round(p.revenue * catRatio);
      profit = Math.round(p.netProfit * catRatio);
      margin = rev > 0 ? Number(((profit / rev) * 100).toFixed(2)) : 0;
    }

    return {
      index: i,
      date: r.date,
      dayOfWeek: r.dayOfWeek,
      revenue: rev,
      profit: profit,
      margin: margin,
      isPayday: r.dayOfMonth >= 25 && r.dayOfMonth <= 28,
      isMonthStart: r.dayOfMonth >= 1 && r.dayOfMonth <= 3,
    };
  });

  const maxVal = Math.max(...points.map((p) => p.revenue), 1000);
  const chartHeight = 240;
  const chartWidth = 800;
  const paddingX = 40;
  const paddingY = 25;
  const graphWidth = chartWidth - paddingX * 2;
  const graphHeight = chartHeight - paddingY * 2;

  const getX = (idx: number) => {
    if (points.length <= 1) return paddingX + graphWidth / 2;
    return paddingX + (idx / (points.length - 1)) * graphWidth;
  };

  const getY = (val: number) => {
    const ratio = Math.max(0, val) / maxVal;
    return chartHeight - paddingY - ratio * graphHeight;
  };

  // Build SVG path for revenue and profit
  const revenuePoints = points.map((p, i) => `${getX(i)},${getY(p.revenue)}`).join(' ');
  const profitPoints = points.map((p, i) => `${getX(i)},${getY(p.profit)}`).join(' ');

  const revenueArea = `${getX(0)},${chartHeight - paddingY} ${revenuePoints} ${getX(points.length - 1)},${chartHeight - paddingY}`;
  const profitArea = `${getX(0)},${chartHeight - paddingY} ${profitPoints} ${getX(points.length - 1)},${chartHeight - paddingY}`;

  const activePoint = hoverIndex !== null && hoverIndex >= 0 && hoverIndex < points.length
    ? points[hoverIndex]
    : points[points.length - 1];

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              แนวโน้มยอดขาย & กำไรสุทธิรายวัน
            </h3>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
              {points.length} รายการ
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            เส้นกราฟเปรียบเทียบยอดขาย (สีน้ำเงิน) กับกำไรสุทธิที่ได้รับจริง (สีเขียว)
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
            <span className="text-slate-700">ยอดขายรวม</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
            <span className="text-slate-700">กำไรสุทธิ</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-amber-400 inline-block"></span>
            <span className="text-slate-500">ช่วงเงินเดือนออก (Payday)</span>
          </div>
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-56 sm:h-64 select-none touch-none"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
            const y = chartHeight - paddingY - pct * graphHeight;
            const val = Math.round(maxVal * pct);
            return (
              <g key={idx}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={chartWidth - paddingX}
                  y2={y}
                  stroke="#F1F5F9"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 6}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[9px] fill-slate-400"
                >
                  {val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
                </text>
              </g>
            );
          })}

          {/* Payday Zone Highlights */}
          {points.map((p, idx) => {
            if (!p.isPayday) return null;
            const x = getX(idx);
            const w = graphWidth / Math.max(1, points.length - 1);
            return (
              <rect
                key={`payday-${idx}`}
                x={x - w / 2}
                y={paddingY}
                width={w}
                height={graphHeight}
                fill="#FEF3C7"
                opacity="0.45"
              />
            );
          })}

          {/* Revenue Area & Line */}
          <polygon points={revenueArea} fill="url(#revGradient)" />
          <polyline
            points={revenuePoints}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Profit Area & Line */}
          <polygon points={profitArea} fill="url(#profitGradient)" />
          <polyline
            points={profitPoints}
            fill="none"
            stroke="#10B981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points and Hover triggers */}
          {points.map((p, idx) => {
            const x = getX(idx);
            const yRev = getY(p.revenue);
            const yProf = getY(p.profit);
            const isHovered = hoverIndex === idx;

            return (
              <g key={idx} className="cursor-pointer">
                {/* Vertical hover guide */}
                {isHovered && (
                  <line
                    x1={x}
                    y1={paddingY}
                    x2={x}
                    y2={chartHeight - paddingY}
                    stroke="#94A3B8"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Revenue point */}
                <circle
                  cx={x}
                  cy={yRev}
                  r={isHovered ? 5 : 2.5}
                  fill="#3B82F6"
                  stroke="#FFFFFF"
                  strokeWidth={isHovered ? 2 : 1}
                />

                {/* Profit point */}
                <circle
                  cx={x}
                  cy={yProf}
                  r={isHovered ? 5 : 2.5}
                  fill="#10B981"
                  stroke="#FFFFFF"
                  strokeWidth={isHovered ? 2 : 1}
                />

                {/* Invisible hover area for touch & mouse */}
                <rect
                  x={x - graphWidth / (points.length * 2)}
                  y={0}
                  width={graphWidth / points.length}
                  height={chartHeight}
                  fill="transparent"
                  onMouseEnter={() => setHoverIndex(idx)}
                  onTouchStart={() => setHoverIndex(idx)}
                />
              </g>
            );
          })}
        </svg>

        {/* Date labels at bottom */}
        <div className="flex justify-between px-8 text-[11px] text-slate-400 font-medium">
          <span>{points[0]?.date}</span>
          <span>{points[Math.floor(points.length / 2)]?.date}</span>
          <span>{points[points.length - 1]?.date}</span>
        </div>
      </div>

      {/* Interactive Tooltip Card */}
      {activePoint && (
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 bg-white border border-slate-200 px-2 py-1 rounded-md shadow-2xs">
              📅 {activePoint.date} ({activePoint.dayOfWeek})
            </span>
            {activePoint.isPayday && (
              <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full font-semibold">
                🔥 Payday Spike
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <span className="text-slate-500 mr-1.5">ยอดขาย:</span>
              <span className="font-bold text-blue-600">฿{activePoint.revenue.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-500 mr-1.5">กำไรสุทธิ:</span>
              <span className="font-bold text-emerald-600">฿{activePoint.profit.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-500 mr-1.5">% กำไร:</span>
              <span className="font-bold text-amber-600">{activePoint.margin}%</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
