import React, { useState } from 'react';
import { DailySalesRecord } from '../types';
import { X, Plus, Calendar, DollarSign, Percent, Save, FileSpreadsheet } from 'lucide-react';

interface AddRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: DailySalesRecord) => Promise<void>;
  isSheetConnected: boolean;
}

export const AddRecordModal: React.FC<AddRecordModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isSheetConnected,
}) => {
  const [date, setDate] = useState('3/10/69');
  const [dayOfWeek, setDayOfWeek] = useState('เสาร์');
  const [month, setMonth] = useState<'sep' | 'oct' | 'nov' | 'dec'>('oct');
  
  const [chiliRev, setChiliRev] = useState<number>(35000);
  const [chiliProfit, setChiliProfit] = useState<number>(5950);
  
  const [machineRev, setMachineRev] = useState<number>(15000);
  const [machineProfit, setMachineProfit] = useState<number>(2700);

  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const totalRevenue = chiliRev + machineRev;
  const totalNetProfit = chiliProfit + machineProfit;
  const marginPercent = totalRevenue > 0 ? Number(((totalNetProfit / totalRevenue) * 100).toFixed(2)) : 0;
  const adSpend = Math.round(totalRevenue * 0.14);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const monthLabel =
        month === 'sep' ? 'กันยายน 2569' :
        month === 'oct' ? 'ตุลาคม 2569' :
        month === 'nov' ? 'พฤศจิกายน 2569' : 'ธันวาคม 2569';

      const chiliMargin = chiliRev > 0 ? Number(((chiliProfit / chiliRev) * 100).toFixed(2)) : 0;
      const machineMargin = machineRev > 0 ? Number(((machineProfit / machineRev) * 100).toFixed(2)) : 0;

      const chiliOrders = Math.max(1, Math.round(chiliRev / 320));
      const machineOrders = Math.max(1, Math.round(machineRev / 12500));
      const totalOrders = chiliOrders + machineOrders;

      const newRecord: DailySalesRecord = {
        id: `rec-${month}-${Date.now()}`,
        date,
        dateObj: `2026-${month === 'sep' ? '09' : month === 'oct' ? '10' : month === 'nov' ? '11' : '12'}-15`,
        month,
        monthLabel,
        dayOfMonth: parseInt(date.split('/')[0]) || 15,
        dayOfWeek,
        totalRevenue,
        totalNetProfit,
        totalAdSpend: adSpend,
        marginPercent,
        chili: {
          revenue: chiliRev,
          netProfit: chiliProfit,
          marginPercent: chiliMargin,
          adSpend: Math.round(adSpend * (chiliRev / totalRevenue || 0.6)),
          orders: chiliOrders,
        },
        machine: {
          revenue: machineRev,
          netProfit: machineProfit,
          marginPercent: machineMargin,
          adSpend: Math.round(adSpend * (machineRev / totalRevenue || 0.4)),
          orders: machineOrders,
        },
        platforms: {
          tiktok: {
            revenue: Math.round(totalRevenue * 0.52),
            netProfit: Math.round(totalNetProfit * 0.48),
            adSpend: Math.round(adSpend * 0.55),
            orders: Math.round(totalOrders * 0.55),
          },
          shopee: {
            revenue: Math.round(totalRevenue * 0.33),
            netProfit: Math.round(totalNetProfit * 0.34),
            adSpend: Math.round(adSpend * 0.32),
            orders: Math.round(totalOrders * 0.35),
          },
          direct: {
            revenue: Math.max(0, totalRevenue - Math.round(totalRevenue * 0.52) - Math.round(totalRevenue * 0.33)),
            netProfit: Math.max(0, totalNetProfit - Math.round(totalNetProfit * 0.48) - Math.round(totalNetProfit * 0.34)),
            adSpend: Math.max(0, adSpend - Math.round(adSpend * 0.55) - Math.round(adSpend * 0.32)),
            orders: Math.max(1, Math.round(totalOrders * 0.10)),
          },
        },
      };

      await onSave(newRecord);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-slate-900">
                บันทึกยอดขายประจำวัน
              </h3>
              <p className="text-xs text-slate-500">
                {isSheetConnected
                  ? 'จะบันทึกลงในระบบและซิงค์เข้า Google Sheet ทันที'
                  : 'บันทึกข้อมูลในระบบแดชบอร์ด'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
          
          {/* Date & Day */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                วันที่ (เช่น 3/10/69)
              </label>
              <input
                type="text"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                วันในสัปดาห์
              </label>
              <select
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:bg-white"
              >
                <option value="จันทร์">วันจันทร์</option>
                <option value="อังคาร">วันอังคาร</option>
                <option value="พุธ">วันพุธ</option>
                <option value="พฤหัสบดี">วันพฤหัสบดี</option>
                <option value="ศุกร์">วันศุกร์</option>
                <option value="เสาร์">วันเสาร์</option>
                <option value="อาทิตย์">วันอาทิตย์</option>
              </select>
            </div>
          </div>

          {/* Month selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              เดือน
            </label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:bg-white"
            >
              <option value="sep">กันยายน 2569</option>
              <option value="oct">ตุลาคม 2569</option>
              <option value="nov">พฤศจิกายน 2569</option>
              <option value="dec">ธันวาคม 2569</option>
            </select>
          </div>

          {/* Chili section */}
          <div className="bg-rose-50/50 p-3.5 rounded-xl border border-rose-100 space-y-2">
            <span className="text-xs font-bold text-rose-700 block">🌶️ หมวดหมู่น้ำพริก</span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-600 block">ยอดขาย (บาท)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={chiliRev}
                  onChange={(e) => setChiliRev(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm text-slate-800 font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-600 block">กำไรสุทธิ (บาท)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={chiliProfit}
                  onChange={(e) => setChiliProfit(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm text-emerald-600 font-bold"
                />
              </div>
            </div>
          </div>

          {/* Machine section */}
          <div className="bg-amber-50/50 p-3.5 rounded-xl border border-amber-100 space-y-2">
            <span className="text-xs font-bold text-amber-700 block">⚙️ หมวดหมู่เครื่องจักร</span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-600 block">ยอดขาย (บาท)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={machineRev}
                  onChange={(e) => setMachineRev(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm text-slate-800 font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-600 block">กำไรสุทธิ (บาท)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={machineProfit}
                  onChange={(e) => setMachineProfit(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm text-emerald-600 font-bold"
                />
              </div>
            </div>
          </div>

          {/* Calculated Totals Summary */}
          <div className="bg-slate-100 p-3 rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 block">รวมยอดขาย</span>
              <span className="font-extrabold text-slate-900 text-sm">
                ฿{totalRevenue.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">รวมกำไรสุทธิ</span>
              <span className="font-extrabold text-emerald-600 text-sm">
                ฿{totalNetProfit.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">% กำไร</span>
              <span className="font-extrabold text-amber-600 text-sm">
                {marginPercent}%
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700 shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
