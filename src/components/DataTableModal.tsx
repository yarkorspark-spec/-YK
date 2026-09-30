import React, { useState } from 'react';
import { DailySalesRecord, CategoryType, PlatformType } from '../types';
import { X, Download, Search, Filter, ArrowUpDown, FileSpreadsheet, ExternalLink } from 'lucide-react';

interface DataTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: DailySalesRecord[];
  spreadsheetUrl: string | null;
}

export const DataTableModal: React.FC<DataTableModalProps> = ({
  isOpen,
  onClose,
  records,
  spreadsheetUrl,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'date' | 'revenue' | 'profit' | 'margin'>('date');
  const [sortAsc, setSortAsc] = useState(false);

  if (!isOpen) return null;

  // Filter
  const filtered = records.filter((r) => {
    return (
      r.date.includes(searchTerm) ||
      r.dayOfWeek.includes(searchTerm) ||
      r.monthLabel.includes(searchTerm)
    );
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'date') {
      comparison = a.dateObj.localeCompare(b.dateObj);
    } else if (sortField === 'revenue') {
      comparison = a.totalRevenue - b.totalRevenue;
    } else if (sortField === 'profit') {
      comparison = a.totalNetProfit - b.totalNetProfit;
    } else if (sortField === 'margin') {
      comparison = a.marginPercent - b.marginPercent;
    }
    return sortAsc ? comparison : -comparison;
  });

  const toggleSort = (field: 'date' | 'revenue' | 'profit' | 'margin') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const exportCSV = () => {
    const headers = [
      'วันที่',
      'วัน',
      'ยอดขายรวม(บาท)',
      'กำไรสุทธิ(บาท)',
      '%กำไร',
      'ยอดขายน้ำพริก',
      'กำไรน้ำพริก',
      'ยอดขายเครื่องจักร',
      'กำไรเครื่องจักร',
      'TikTokยอดขาย',
      'Shopeeยอดขาย',
      'เพจตรง/LineOAยอดขาย',
    ];

    const rows = sorted.map((r) => [
      `"${r.date}"`,
      `"${r.dayOfWeek}"`,
      r.totalRevenue,
      r.totalNetProfit,
      r.marginPercent,
      r.chili.revenue,
      r.chili.netProfit,
      r.machine.revenue,
      r.machine.netProfit,
      r.platforms.tiktok.revenue,
      r.platforms.shopee.revenue,
      r.platforms.direct.revenue,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sales_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-slate-900">
                ตารางบันทึกยอดขายและกำไรทั้งหมด
              </h3>
              <p className="text-xs text-slate-500">
                แสดงข้อมูลรายวัน รายหมวดหมู่ และรายแพลตฟอร์ม ({sorted.length} วัน)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {spreadsheetUrl && (
              <a
                href={spreadsheetUrl}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
              >
                <span>เปิดใน Google Sheets</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ส่งออก CSV</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-3 sm:px-5 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="ค้นหาวันที่, วันในสัปดาห์ เช่น '1/9/69', 'ศุกร์'..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-xs text-slate-600 border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0 z-10 shadow-2xs">
              <tr>
                <th
                  onClick={() => toggleSort('date')}
                  className="py-3 px-3 sm:px-4 cursor-pointer hover:bg-slate-200/60"
                >
                  <div className="flex items-center gap-1">
                    <span>วันที่</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('revenue')}
                  className="py-3 px-3 sm:px-4 cursor-pointer hover:bg-slate-200/60 text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>ยอดขายรวม (บาท)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('profit')}
                  className="py-3 px-3 sm:px-4 cursor-pointer hover:bg-slate-200/60 text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>กำไรสุทธิ (บาท)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('margin')}
                  className="py-3 px-3 sm:px-4 cursor-pointer hover:bg-slate-200/60 text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>% กำไร</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3 sm:px-4 text-right hidden md:table-cell">
                  🌶️ ยอดน้ำพริก
                </th>
                <th className="py-3 px-3 sm:px-4 text-right hidden md:table-cell">
                  ⚙️ ยอดเครื่องจักร
                </th>
                <th className="py-3 px-3 sm:px-4 text-right hidden lg:table-cell">
                  🎵 TikTok
                </th>
                <th className="py-3 px-3 sm:px-4 text-right hidden lg:table-cell">
                  🛍️ Shopee
                </th>
                <th className="py-3 px-3 sm:px-4 text-right hidden xl:table-cell">
                  💬 เพจตรง/Line
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sorted.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3 sm:px-4 font-semibold text-slate-800">
                    <div>{r.date}</div>
                    <div className="text-[10px] text-slate-400">{r.dayOfWeek}</div>
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-right font-bold text-slate-900">
                    ฿{r.totalRevenue.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-right font-bold text-emerald-600">
                    ฿{r.totalNetProfit.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-right">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-bold ${
                        r.marginPercent >= 16
                          ? 'bg-emerald-50 text-emerald-700'
                          : r.marginPercent >= 12
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {r.marginPercent}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-right hidden md:table-cell text-rose-600 font-medium">
                    ฿{r.chili.revenue.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-right hidden md:table-cell text-amber-700 font-medium">
                    ฿{r.machine.revenue.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-right hidden lg:table-cell text-slate-700">
                    ฿{r.platforms.tiktok.revenue.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-right hidden lg:table-cell text-orange-600">
                    ฿{r.platforms.shopee.revenue.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-right hidden xl:table-cell text-emerald-700">
                    ฿{r.platforms.direct.revenue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
          <span>แสดงทั้งหมด {sorted.length} แถว</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-700"
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
};
