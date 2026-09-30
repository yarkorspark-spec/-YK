import React from 'react';
import { CategoryType, PlatformType, MonthFilter } from '../types';
import { Layers, Store, Calendar, Filter } from 'lucide-react';

interface FilterBarProps {
  selectedCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  selectedPlatform: PlatformType;
  onSelectPlatform: (platform: PlatformType) => void;
  selectedMonth: MonthFilter;
  onSelectMonth: (month: MonthFilter) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedPlatform,
  onSelectPlatform,
  selectedMonth,
  onSelectMonth,
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200 space-y-4">
      
      {/* Top row: Category Selector (Main Pivot) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
          <Layers className="w-4 h-4 text-rose-600" />
          <span>หมวดหมู่สินค้าหลัก:</span>
        </div>
        
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl sm:w-auto">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-3 py-2 sm:px-4 sm:py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              selectedCategory === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📊 ภาพรวมทั้งหมด
          </button>
          <button
            onClick={() => onSelectCategory('chili')}
            className={`px-3 py-2 sm:px-4 sm:py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              selectedCategory === 'chili'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🌶️ น้ำพริก
          </button>
          <button
            onClick={() => onSelectCategory('machine')}
            className={`px-3 py-2 sm:px-4 sm:py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              selectedCategory === 'machine'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ⚙️ เครื่องจักร
          </button>
        </div>
      </div>

      {/* Bottom row: Platform & Month Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        
        {/* Platform Selection */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mr-1">
            <Store className="w-3.5 h-3.5 text-indigo-600" />
            <span>แพลตฟอร์ม:</span>
          </div>

          <div className="flex flex-wrap gap-1">
            {[
              { id: 'all', label: 'ทุกช่องทาง' },
              { id: 'tiktok', label: '🎵 TikTok Shop' },
              { id: 'shopee', label: '🛍️ Shopee' },
              { id: 'direct', label: '💬 เพจตรง / Line OA' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => onSelectPlatform(p.id as PlatformType)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedPlatform === p.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Month Selection */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span>ช่วงเวลา:</span>
          </div>
          <select
            value={selectedMonth}
            onChange={(e) => onSelectMonth(e.target.value as MonthFilter)}
            className="text-xs sm:text-sm font-medium bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
          >
            <option value="all">ทั้งปี 2569 (รวมทุกเดือน)</option>
            <option value="sep">เดือนกันยายน 2569</option>
            <option value="oct">เดือนตุลาคม 2569</option>
            <option value="nov">เดือนพฤศจิกายน 2569</option>
            <option value="dec">เดือนธันวาคม 2569</option>
          </select>
        </div>

      </div>

    </div>
  );
};
