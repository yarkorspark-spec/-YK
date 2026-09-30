import React, { useState } from 'react';
import { DailySalesRecord } from '../types';
import { 
  Lightbulb, 
  CalendarClock, 
  AlertTriangle, 
  Calculator, 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Flame,
  Cog,
  DollarSign
} from 'lucide-react';

interface MarketingInsightsProps {
  records: DailySalesRecord[];
}

export const MarketingInsights: React.FC<MarketingInsightsProps> = ({ records }) => {
  // Simulator state
  const [targetProfit, setTargetProfit] = useState<number>(100000);

  // Day of week analysis
  const dayStats: Record<string, { totalRev: number; totalProfit: number; count: number }> = {
    'จันทร์': { totalRev: 0, totalProfit: 0, count: 0 },
    'อังคาร': { totalRev: 0, totalProfit: 0, count: 0 },
    'พุธ': { totalRev: 0, totalProfit: 0, count: 0 },
    'พฤหัสบดี': { totalRev: 0, totalProfit: 0, count: 0 },
    'ศุกร์': { totalRev: 0, totalProfit: 0, count: 0 },
    'เสาร์': { totalRev: 0, totalProfit: 0, count: 0 },
    'อาทิตย์': { totalRev: 0, totalProfit: 0, count: 0 },
  };

  records.forEach((r) => {
    if (dayStats[r.dayOfWeek]) {
      dayStats[r.dayOfWeek].totalRev += r.totalRevenue;
      dayStats[r.dayOfWeek].totalProfit += r.totalNetProfit;
      dayStats[r.dayOfWeek].count += 1;
    }
  });

  const dayAverages = Object.entries(dayStats).map(([day, stat]) => ({
    day,
    avgRev: stat.count > 0 ? Math.round(stat.totalRev / stat.count) : 0,
    avgProfit: stat.count > 0 ? Math.round(stat.totalProfit / stat.count) : 0,
    count: stat.count,
  }));

  const maxAvgRev = Math.max(...dayAverages.map((d) => d.avgRev), 1);

  // Simulator calculations
  // Average profit margin is ~16%, Ad spend ratio ~14%
  const estimatedRevenueNeeded = Math.round(targetProfit / 0.16);
  const estimatedAdSpend = Math.round(estimatedRevenueNeeded * 0.14);
  const estimatedChiliOrders = Math.round((estimatedRevenueNeeded * 0.65) / 320);
  const estimatedMachineDeals = Math.round((estimatedRevenueNeeded * 0.35) / 12500);

  return (
    <div className="space-y-6">
      
      {/* 1. Marketing Strategic Recommendations */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              ข้อเสนอแนะเชิงกลยุทธ์การตลาด (Marketing Action Plan)
            </h3>
            <p className="text-xs text-slate-500">
              วิเคราะห์จากสถิติยอดขายจริงเพื่อช่วยเพิ่มผลกำไรและลดการเสียงบแอด
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          
          {/* Card 1: Payday Acceleration */}
          <div className="bg-linear-to-b from-amber-50/60 to-white rounded-xl p-4 border border-amber-200/80 space-y-2">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>1. ช่วงทองเร่งยอด (25 - 2 ของเดือน)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              ยอดขายกระโดดขึ้นถึง <strong>฿45,000 - ฿57,000/วัน</strong> ในช่วงเงินเดือนออก แนะนำให้:
            </p>
            <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
              <li>เพิ่มงบยิงแอดล่วงหน้า 30% ตั้งแต่วันที่ 23</li>
              <li>จัดเซ็ตของฝาก/แพ็คเกจ 3-5 กระปุก ดันตะกร้าให้สูงขึ้น</li>
              <li>จัดไลฟ์ TikTok ต่อเนื่องในช่วง 19:00 - 23:00 น.</li>
            </ul>
          </div>

          {/* Card 2: Margin Protection */}
          <div className="bg-linear-to-b from-rose-50/60 to-white rounded-xl p-4 border border-rose-200/80 space-y-2">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>2. ควบคุมส่วนลดปกป้องกำไร (Margin Floor)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              บางวันกำไรลดลงเหลือ <strong>5% - 11%</strong> เนื่องจากโค้ดส่วนลดทับซ้อนและค่าคอมนายหน้า:
            </p>
            <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
              <li>ตั้งเกณฑ์ % กำไรขั้นต่ำไม่ต่ำกว่า 15% เสมอ</li>
              <li>เน้นให้ของแถมสูตรใหม่แทนการลดราคาตรงๆ</li>
              <li>ดึงลูกค้าประจำจาก TikTok มาสะสมแต้มบน Line OA</li>
            </ul>
          </div>

          {/* Card 3: Cross-sell Machinery */}
          <div className="bg-linear-to-b from-indigo-50/60 to-white rounded-xl p-4 border border-indigo-200/80 space-y-2">
            <div className="flex items-center gap-2 text-indigo-800 font-bold text-sm">
              <Cog className="w-4 h-4 text-indigo-600" />
              <span>3. Synergy เครื่องจักร + น้ำพริก</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              ผู้ซื้อเครื่องจักรคือ <strong>กลุ่มผู้ผลิตอาหาร/SME</strong> ที่กำลังขยายธุรกิจ:
            </p>
            <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
              <li>แถมสูตรน้ำพริกหรือการสอนคำนวณต้นทุนเมื่อซื้อเครื่อง</li>
              <li>ยิงแอด Lead Form บน Facebook เน้นกลุ่มคนอยากมีแบรนด์</li>
              <li>ปิดการขายผ่านโทรศัพท์และแอดมิน Line OA</li>
            </ul>
          </div>

        </div>
      </div>

      {/* 2. Day of Week Analysis */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-xs">
              <CalendarClock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                ยอดขายเฉลี่ยตามวันในสัปดาห์ (Day of the Week Pattern)
              </h3>
              <p className="text-xs text-slate-500">
                ใช้กำหนดเวลาเปิด-ปิด หรือปรับสัดส่วนงบโฆษณา (Ad Scheduling)
              </p>
            </div>
          </div>
        </div>

        {/* Day Bars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 pt-2">
          {dayAverages.map((d) => {
            const barHeightPct = Math.round((d.avgRev / maxAvgRev) * 100);
            const isTop = barHeightPct >= 85;

            return (
              <div
                key={d.day}
                className={`p-3 rounded-xl border text-center transition-all ${
                  isTop
                    ? 'border-blue-300 bg-blue-50/50 shadow-xs'
                    : 'border-slate-200 bg-slate-50/50'
                }`}
              >
                <span className="text-xs font-bold text-slate-700 block mb-1">
                  วัน{d.day}
                </span>
                
                {/* Visual Bar Indicator */}
                <div className="h-16 w-full bg-slate-200 rounded-md overflow-hidden flex flex-col justify-end p-0.5 my-2">
                  <div
                    style={{ height: `${barHeightPct}%` }}
                    className={`w-full rounded-xs transition-all ${
                      isTop ? 'bg-blue-600' : 'bg-slate-400'
                    }`}
                  />
                </div>

                <div className="text-xs font-extrabold text-slate-900">
                  ฿{d.avgRev.toLocaleString()}
                </div>
                <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                  กำไร ~฿{d.avgProfit.toLocaleString()}
                </div>
                {isTop && (
                  <span className="inline-block mt-1 text-[9px] bg-blue-600 text-white font-bold px-1.5 py-0.5 rounded-full">
                    แนะนำยิงแอด
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Target & Ad Budget Calculator */}
      <div className="bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-4 sm:p-6 text-white shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-xs">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold tracking-tight">
                เครื่องมือคำนวณเป้าหมายกำไร & งบโฆษณา (Target Simulator)
              </h3>
              <p className="text-xs text-slate-300">
                ตั้งเป้ากำไรสุทธิที่ต้องการ เพื่อคำนวณยอดขาย งบแอด และจำนวนออเดอร์ที่ต้องทำให้สำเร็จ
              </p>
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400">เป้าหมายเร็ว:</span>
            {[50000, 100000, 200000, 500000].map((val) => (
              <button
                key={val}
                onClick={() => setTargetProfit(val)}
                className={`px-2 py-1 rounded-md transition-colors ${
                  targetProfit === val
                    ? 'bg-rose-500 text-white font-bold'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                }`}
              >
                ฿{(val / 1000).toFixed(0)}k
              </button>
            ))}
          </div>
        </div>

        {/* Input slider / field */}
        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 flex-1">
            <label className="text-xs text-slate-300 font-medium">
              ใส่เป้าหมายกำไรสุทธิที่คุณต้องการ (บาท):
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-bold">฿</span>
              <input
                type="number"
                value={targetProfit}
                onChange={(e) => setTargetProfit(Math.max(1000, Number(e.target.value) || 0))}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-8 pr-4 py-2 text-white font-extrabold text-lg focus:outline-hidden focus:border-rose-400"
              />
            </div>
          </div>

          <div className="flex-1">
            <input
              type="range"
              min="10000"
              max="500000"
              step="5000"
              value={targetProfit}
              onChange={(e) => setTargetProfit(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>฿10,000</span>
              <span>฿250,000</span>
              <span>฿500,000</span>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700">
            <span className="text-xs text-slate-400 block mb-1">ยอดขายรวมที่ต้องทำ</span>
            <span className="text-lg sm:text-xl font-extrabold text-blue-400">
              ฿{estimatedRevenueNeeded.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">
              (อิงกำไรเฉลี่ย 16%)
            </span>
          </div>

          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700">
            <span className="text-xs text-slate-400 block mb-1">งบโฆษณาที่ควรจัดสรร</span>
            <span className="text-lg sm:text-xl font-extrabold text-purple-400">
              ฿{estimatedAdSpend.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">
              (งบ 14% ของยอดขาย)
            </span>
          </div>

          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700">
            <span className="text-xs text-slate-400 block mb-1">🌶️ เป้าออเดอร์น้ำพริก</span>
            <span className="text-lg sm:text-xl font-extrabold text-rose-400">
              ~{estimatedChiliOrders.toLocaleString()} ชุด
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">
              (เฉลี่ย ฿320 / ออเดอร์)
            </span>
          </div>

          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700">
            <span className="text-xs text-slate-400 block mb-1">⚙️ เป้าปิดดีลเครื่องจักร</span>
            <span className="text-lg sm:text-xl font-extrabold text-amber-400">
              ~{estimatedMachineDeals.toLocaleString()} เครื่อง
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">
              (เฉลี่ย ฿12,500 / เครื่อง)
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
