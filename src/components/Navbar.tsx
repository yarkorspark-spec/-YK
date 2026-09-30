import React from 'react';
import { User } from 'firebase/auth';
import { 
  BarChart3, 
  FileSpreadsheet, 
  Plus, 
  TableProperties, 
  Sparkles, 
  LogOut, 
  ExternalLink,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { GoogleSheetSyncState } from '../types';

interface NavbarProps {
  user: User | null;
  syncState: GoogleSheetSyncState;
  onSignIn: () => void;
  onSignOut: () => void;
  onOpenAddModal: () => void;
  onOpenTableModal: () => void;
  onOpenSheetModal: () => void;
  onManualSync: () => void;
  isLoggingIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  syncState,
  onSignIn,
  onSignOut,
  onOpenAddModal,
  onOpenTableModal,
  onOpenSheetModal,
  onManualSync,
  isLoggingIn,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-amber-600 via-rose-600 to-red-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
                  น้ำพริก & เครื่องจักร
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
                  Business Analytics
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                แดชบอร์ดยอดขาย กำไรสุทธิ และวิเคราะห์การตลาด 2569
              </p>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Real-time Google Sheet Sync Status & Manual Sync Button */}
            {syncState.spreadsheetId ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onOpenSheetModal}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                  title={`เชื่อมต่อกับ: ${syncState.spreadsheetTitle || 'Google Sheet'}\nซิงค์ล่าสุด: ${syncState.lastSyncedAt || '-'}`}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                  </span>
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden lg:inline font-semibold">
                    ซิงค์สด Real-time
                  </span>
                  <span className="hidden sm:inline-block lg:hidden font-semibold">
                    ชีตสด
                  </span>
                </button>

                {/* Instant Sync Button */}
                <button
                  onClick={onManualSync}
                  disabled={syncState.isSyncing}
                  className="p-1.5 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
                  title="ซิงค์ข้อมูลจาก Google Sheets ทันที"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncState.isSyncing ? 'animate-spin text-emerald-600' : ''}`} />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenSheetModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition-all"
                title="เชื่อมต่อ Google Sheets ครั้งเดียว"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span className="hidden md:inline">เชื่อมต่อ Google Sheets</span>
                <span className="md:hidden">Sheets</span>
              </button>
            )}

            {/* View Full Data Table Button */}
            <button
              onClick={onOpenTableModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
              title="ดูตารางข้อมูลทั้งหมด"
            >
              <TableProperties className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">ตารางข้อมูล</span>
            </button>

            {/* Quick Add Record Button */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-colors active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>บันทึกยอด</span>
            </button>

            {/* User Auth Section */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-8 h-8 rounded-full border border-slate-300"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold">
                    {user.email?.slice(0, 1).toUpperCase()}
                  </div>
                )}
                <button
                  onClick={onSignOut}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  title="ออกจากระบบ"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onSignIn}
                disabled={isLoggingIn}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs transition-colors"
              >
                {/* Official Google SVG Icon */}
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <span className="hidden md:inline">เข้าสู่ระบบ Google</span>
                <span className="md:hidden">Google</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
