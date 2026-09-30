import React from 'react';
import { DailySalesRecord } from '../types';
import { Flame, Cog, ArrowRight, ShieldCheck, Zap, ShoppingBag } from 'lucide-react';

interface CategoryComparisonProps {
  records: DailySalesRecord[];
}

export const CategoryComparison: React.FC<CategoryComparisonProps> = ({ records }) => {
  let chiliRev = 0;
  let chiliProfit = 0;
  let chiliOrders = 0;
  let chiliAdSpend = 0;

  let machineRev = 0;
  let machineProfit = 0;
  let machineOrders = 0;
  let machineAdSpend = 0;

  records.forEach((r) => {
    chiliRev += r.chili.revenue;
    chiliProfit += r.chili.netProfit;
    chiliOrders += r.chili.orders;
    chiliAdSpend += r.chili.adSpend;

    machineRev += r.machine.revenue;
    machineProfit += r.machine.netProfit;
    machineOrders += r.machine.orders;
    machineAdSpend += r.machine.adSpend;
  });

  const totalRev = chiliRev + machineRev;
  const totalProfit = chiliProfit + machineProfit;

  const chiliRevPct = totalRev > 0 ? ((chiliRev / totalRev) * 100).toFixed(1) : '0';
  const machineRevPct = totalRev > 0 ? ((machineRev / totalRev) * 100).toFixed(1) : '0';

  const chiliMargin = chiliRev > 0 ? ((chiliProfit / chiliRev) * 100).toFixed(2) : '0.00';
  const machineMargin = machineRev > 0 ? ((machineProfit / machineRev) * 100).toFixed(2) : '0.00';

  const chiliAov = chiliOrders > 0 ? Math.round(chiliRev / chiliOrders) : 0;
  const machineAov = machineOrders > 0 ? Math.round(machineRev / machineOrders) : 0;

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-2xs space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>เปรียบเทียบสัดส่วน: น้ำพริก VS เครื่องจักร</span>
          </h3>
          <p className="text-xs text-slate-500">
            วิเคราะห์สัดส่วนรายได้ อัตรากำไร และบทบาทของแต่ละกลุ่มสินค้าต่อโมเดลธุรกิจ
          </p>
        </div>
        <div className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700 self-start">
          สัดส่วนรายได้: {chiliRevPct}% น้ำพริก / {machineRevPct}% เครื่องจักร
        </div>
      </div>

      {/* Visual Proportion Bar */}
      <div className="space-y-1.5">
        <div className="h-4 w-full rounded-full bg-slate-100 overflow-hidden flex shadow-inner">
          <div
            style={{ width: `${chiliRevPct}%` }}
            className="bg-linear-to-r from-rose-500 to-red-600 transition-all duration-500"
            title={`น้ำพริก: ${chiliRevPct}%`}
          />
          <div
            style={{ width: `${machineRevPct}%` }}
            className="bg-linear-to-r from-amber-500 to-amber-600 transition-all duration-500"
            title={`เครื่องจักร: ${machineRevPct}%`}
          />
        </div>
        <div className="flex justify-between text-xs font-medium text-slate-500 px-1">
          <span className="text-rose-600 font-semibold">🌶️ น้ำพริก ({chiliRevPct}%)</span>
          <span className="text-amber-600 font-semibold">⚙️ เครื่องจักร ({machineRevPct}%)</span>
        </div>
      </div>

      {/* Side-by-side comparison cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Card 1: Chili Paste */}
        <div className="border border-rose-100 bg-rose-50/30 rounded-xl p-4 sm:p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">หมวดหมู่น้ำพริก (B2C)</h4>
                <p className="text-[11px] text-rose-700 font-medium">สินค้าบริโภคหมุนเวียนเร็ว (Fast Moving)</p>
              </div>
            </div>
            <span className="text-xs font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
              Volume Driver
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 my-3">
            <div className="bg-white/80 p-2.5 rounded-lg border border-rose-100/60">
              <span className="text-xs text-slate-500 block">ยอดขายน้ำพริก</span>
              <span className="text-base sm:text-lg font-extrabold text-slate-900">
                ฿{chiliRev.toLocaleString()}
              </span>
            </div>
            <div className="bg-white/80 p-2.5 rounded-lg border border-rose-100/60">
              <span className="text-xs text-slate-500 block">กำไรสุทธิน้ำพริก</span>
              <span className="text-base sm:text-lg font-extrabold text-emerald-600">
                ฿{chiliProfit.toLocaleString()}
              </span>
            </div>
            <div className="bg-white/80 p-2.5 rounded-lg border border-rose-100/60">
              <span className="text-xs text-slate-500 block">อัตรากำไร (Margin)</span>
              <span className="text-base sm:text-lg font-extrabold text-amber-600">
                {chiliMargin}%
              </span>
            </div>
            <div className="bg-white/80 p-2.5 rounded-lg border border-rose-100/60">
              <span className="text-xs text-slate-500 block">ออเดอร์เฉลี่ย (AOV)</span>
              <span className="text-base sm:text-lg font-extrabold text-slate-900">
                ฿{chiliAov.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-600 space-y-1 bg-white/60 p-3 rounded-lg border border-rose-100/50">
            <div className="font-semibold text-rose-900 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-rose-600" />
              <span>จุดเด่น & บทบาทการตลาด:</span>
            </div>
            <p>
              สร้างกระแสเงินสดต่อเนื่องทุกวัน (Cashflow), โอกาสซื้อซ้ำสูง เหมาะกับการทำ Live TikTok, จัด Flash Sale แพ็คคู่ และการใช้ Creator Affiliate
            </p>
          </div>
        </div>

        {/* Card 2: Machinery */}
        <div className="border border-amber-100 bg-amber-50/30 rounded-xl p-4 sm:p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
                <Cog className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">หมวดหมู่เครื่องจักร (B2B / SME)</h4>
                <p className="text-[11px] text-amber-700 font-medium">เครื่องซีล, เครื่องกวน, อุปกรณ์ผลิต</p>
              </div>
            </div>
            <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
              Margin Driver
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 my-3">
            <div className="bg-white/80 p-2.5 rounded-lg border border-amber-100/60">
              <span className="text-xs text-slate-500 block">ยอดขายเครื่องจักร</span>
              <span className="text-base sm:text-lg font-extrabold text-slate-900">
                ฿{machineRev.toLocaleString()}
              </span>
            </div>
            <div className="bg-white/80 p-2.5 rounded-lg border border-amber-100/60">
              <span className="text-xs text-slate-500 block">กำไรสุทธิเครื่องจักร</span>
              <span className="text-base sm:text-lg font-extrabold text-emerald-600">
                ฿{machineProfit.toLocaleString()}
              </span>
            </div>
            <div className="bg-white/80 p-2.5 rounded-lg border border-amber-100/60">
              <span className="text-xs text-slate-500 block">อัตรากำไร (Margin)</span>
              <span className="text-base sm:text-lg font-extrabold text-amber-600">
                {machineMargin}%
              </span>
            </div>
            <div className="bg-white/80 p-2.5 rounded-lg border border-amber-100/60">
              <span className="text-xs text-slate-500 block">ยอดต่อออเดอร์ (Ticket)</span>
              <span className="text-base sm:text-lg font-extrabold text-slate-900">
                ฿{machineAov.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-600 space-y-1 bg-white/60 p-3 rounded-lg border border-amber-100/50">
            <div className="font-semibold text-amber-900 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>จุดเด่น & บทบาทการตลาด:</span>
            </div>
            <p>
              ยอดขายต่อใบเสร็จสูง ให้กำไรเป็นก้อนโต เหมาะกับกลุ่มลูกค้าเริ่มทำแบรนด์อาหาร/น้ำพริก ควรเน้นโฆษณา Lead Generation และส่งเข้าแชท Line OA
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
