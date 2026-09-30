import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { GoogleSheetSyncState, DailySalesRecord } from '../types';
import { 
  X, 
  FileSpreadsheet, 
  CheckCircle2, 
  ExternalLink, 
  RefreshCw, 
  PlusCircle, 
  Link as LinkIcon, 
  AlertCircle,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface GoogleSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  syncState: GoogleSheetSyncState;
  onSignIn: () => void;
  onCreateNewSheet: () => Promise<void>;
  onConnectExistingSheet: (idOrUrl: string) => Promise<void>;
  onSyncAllData: () => Promise<void>;
  onPullDataFromSheet: () => Promise<void>;
  onToggleAutoSync: (enabled: boolean) => void;
  onChangeSyncInterval: (seconds: number) => void;
  onDisconnectSheet: () => void;
  totalRecordsCount: number;
}

export const GoogleSheetModal: React.FC<GoogleSheetModalProps> = ({
  isOpen,
  onClose,
  user,
  syncState,
  onSignIn,
  onCreateNewSheet,
  onConnectExistingSheet,
  onSyncAllData,
  onPullDataFromSheet,
  onToggleAutoSync,
  onChangeSyncInterval,
  onDisconnectSheet,
  totalRecordsCount,
}) => {
  const [existingInput, setExistingInput] = useState('');
  const [showConfirmSync, setShowConfirmSync] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreate = async () => {
    setLoadingAction('create');
    setActionMessage(null);
    try {
      await onCreateNewSheet();
      setActionMessage('สร้างและเชื่อมต่อ Google Sheet ถาวรสำเร็จแล้ว!');
    } catch (err: any) {
      setActionMessage(err.message || 'เกิดข้อผิดพลาดในการสร้างสเปรดชีต');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleConnectExisting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!existingInput.trim()) return;

    setLoadingAction('connect');
    setActionMessage(null);
    try {
      await onConnectExistingSheet(existingInput.trim());
      setActionMessage('เชื่อมต่อ Google Sheet ถาวรสำเร็จแล้ว!');
    } catch (err: any) {
      setActionMessage(err.message || 'ไม่สามารถเชื่อมต่อสเปรดชีตนี้ได้ โปรดตรวจสอบ ID หรือสิทธิ์');
    } finally {
      setLoadingAction(null);
    }
  };

  const handlePullLatest = async () => {
    setLoadingAction('pull');
    setActionMessage(null);
    try {
      await onPullDataFromSheet();
      setActionMessage('ดึงข้อมูลล่าสุดจาก Google Sheet สำเร็จแล้ว!');
    } catch (err: any) {
      setActionMessage(err.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลจากชีต');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleExecuteSync = async () => {
    setLoadingAction('sync');
    setShowConfirmSync(false);
    setActionMessage(null);
    try {
      await onSyncAllData();
      setActionMessage('อัปเดตข้อมูลทั้งหมดขึ้น Google Sheet สำเร็จแล้ว!');
    } catch (err: any) {
      setActionMessage(err.message || 'เกิดข้อผิดพลาดในการซิงค์ข้อมูล');
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-slate-900">
                จัดการเชื่อมต่อ Google Sheets
              </h3>
              <p className="text-xs text-slate-500">
                จัดเก็บและซิงค์ข้อมูลยอดขาย กำไร และแพลตฟอร์มบน Google Drive
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

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Status Message Toast */}
          {actionMessage && (
            <div className="p-3 rounded-xl bg-slate-900 text-white text-xs flex items-center justify-between">
              <span>{actionMessage}</span>
              <button
                onClick={() => setActionMessage(null)}
                className="text-slate-400 hover:text-white ml-2 text-xs"
              >
                ✕
              </button>
            </div>
          )}

          {/* 1. Account Authentication */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || ''}
                      className="w-9 h-9 rounded-full border border-slate-300"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold">
                      {user.email?.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-slate-900 block">
                      {user.displayName || user.email}
                    </span>
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      เชื่อมต่อบัญชี Google สำเร็จ
                    </span>
                  </div>
                </>
              ) : (
                <div>
                  <span className="font-bold text-xs sm:text-sm text-slate-900 block">
                    ยังไม่ได้เข้าสู่ระบบ Google
                  </span>
                  <span className="text-[11px] text-slate-500">
                    เข้าสู่ระบบเพื่ออนุญาตให้เข้าถึง Google Sheets
                  </span>
                </div>
              )}
            </div>

            {!user && (
              <button
                onClick={onSignIn}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                เข้าสู่ระบบ
              </button>
            )}
          </div>

          {/* 2. Connected Sheet Status Card (if connected) */}
          {syncState.spreadsheetId ? (
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-3.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                    </span>
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                      เชื่อมต่อสำเร็จ • จดจำชีตนี้ถาวร
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 mt-0.5">
                    {syncState.spreadsheetTitle || 'สเปรดชีตยอดขาย'}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                    ID: {syncState.spreadsheetId.slice(0, 18)}...
                  </p>
                </div>
                {syncState.spreadsheetUrl && (
                  <a
                    href={syncState.spreadsheetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-100/80 px-2.5 py-1.5 rounded-lg border border-emerald-200 shrink-0"
                  >
                    <span>เปิดสเปรดชีต</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Real-time Auto-Sync Settings */}
              <div className="bg-white/80 p-3 rounded-lg border border-emerald-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">
                      ⚡ ซิงค์อัตโนมัติแบบเรียลไทม์ (Real-time Auto-Sync)
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={syncState.autoSyncEnabled}
                      onChange={(e) => onToggleAutoSync(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1">
                  <span>ความถี่ในการตรวจสอบข้อมูล:</span>
                  <select
                    value={syncState.syncIntervalSeconds}
                    onChange={(e) => onChangeSyncInterval(Number(e.target.value))}
                    className="bg-white border border-slate-200 rounded px-2 py-0.5 text-[11px] font-semibold text-slate-800"
                  >
                    <option value={15}>ทุก 15 วินาที (เร็วสุด)</option>
                    <option value={30}>ทุก 30 วินาที</option>
                    <option value={60}>ทุก 1 นาที</option>
                  </select>
                </div>

                <p className="text-[10px] text-slate-500">
                  * เมื่อแก้ไขตัวเลขใน Google Sheet แดชบอร์ดจะตรวจพบและอัปเดตตัวเลขกราฟให้สดๆ ทันที
                </p>
              </div>

              {syncState.lastSyncedAt && (
                <div className="text-[11px] text-emerald-700 font-medium flex items-center justify-between">
                  <span>สถานะ: ซิงค์ล่าสุดเมื่อ {syncState.lastSyncedAt}</span>
                  <span className="text-slate-400 text-[10px]">บันทึกในเครื่องอัตโนมัติ</span>
                </div>
              )}

              {/* Action Buttons: Pull & Push */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={handlePullLatest}
                  disabled={loadingAction === 'pull'}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingAction === 'pull' ? 'animate-spin' : ''}`} />
                  <span>{loadingAction === 'pull' ? 'กำลังดึง...' : 'ดึงข้อมูลล่าสุดจาก Sheet'}</span>
                </button>

                <button
                  onClick={() => setShowConfirmSync(true)}
                  disabled={loadingAction === 'sync'}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                >
                  <span>ส่งยอดทั้งหมดขึ้น Sheet</span>
                </button>
              </div>

              {/* Disconnect button */}
              <div className="text-center pt-1 border-t border-emerald-100">
                <button
                  onClick={onDisconnectSheet}
                  className="text-[11px] text-rose-600 hover:text-rose-700 hover:underline"
                >
                  ✕ ยกเลิกการเชื่อมต่อชีตนี้ (เปลี่ยนชีตใหม่)
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Option A: 1-Click Create New Sheet */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2.5">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <PlusCircle className="w-4 h-4 text-emerald-600" />
                  <span>ตัวเลือกที่ 1: สร้าง Google Sheet ใหม่อัตโนมัติ (แนะนำ)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  ระบบจะสร้างไฟล์สเปรดชีตใหม่ใน Google Drive ของคุณ พร้อมตั้งแท็บข้อมูล "ภาพรวมรายวัน", "แยกน้ำพริกและเครื่องจักร" และ "แยกตามแพลตฟอร์ม" ครบถ้วน
                </p>
                <button
                  onClick={handleCreate}
                  disabled={!user || loadingAction === 'create'}
                  className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold text-white shadow-xs transition-colors ${
                    !user
                      ? 'bg-slate-400 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>
                    {loadingAction === 'create'
                      ? 'กำลังสร้างสเปรดชีต...'
                      : 'สร้าง Google Sheet และใส่ข้อมูลทันที (1-Click)'}
                  </span>
                </button>
                {!user && (
                  <p className="text-[11px] text-amber-600">
                    * โปรดเข้าสู่ระบบ Google ด้านบนก่อนสร้างชีต
                  </p>
                )}
              </div>

              {/* Option B: Connect Existing Sheet */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2.5">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <LinkIcon className="w-4 h-4 text-blue-600" />
                  <span>ตัวเลือกที่ 2: เชื่อมโยงกับ Google Sheet ที่มีอยู่แล้ว (กดครั้งเดียว)</span>
                </div>
                <p className="text-xs text-slate-600">
                  วาง Spreadsheet ID หรือ URL ของสเปรดชีตของคุณ (ระบบจะจำชีตนี้ถาวรและเปิดซิงค์สดทันที):
                </p>
                <form onSubmit={handleConnectExisting} className="space-y-2">
                  <input
                    type="text"
                    placeholder="เช่น 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms หรือ URL สเปรดชีต"
                    value={existingInput}
                    onChange={(e) => setExistingInput(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800"
                  />
                  <button
                    type="submit"
                    disabled={!existingInput.trim() || loadingAction === 'connect'}
                    className={`w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white transition-colors ${
                      !existingInput.trim()
                        ? 'bg-slate-300 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    <span>{loadingAction === 'connect' ? 'กำลังเชื่อมต่อและดึงข้อมูล...' : 'เชื่อมโยงสเปรดชีตนี้ (จำถาวร)'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>

                <div className="p-2.5 rounded-lg bg-blue-50/80 border border-blue-200 text-[11px] text-blue-900 space-y-1">
                  <div className="font-semibold flex items-center gap-1">
                    <span>💡 เคล็ดลับการซิงค์แบบเรียลไทม์:</span>
                  </div>
                  <p className="text-[10px] text-blue-800 leading-relaxed">
                    ใน Google Sheet แนะนำให้คลิกปุ่ม <strong>"แชร์" (Share)</strong> มุมขวาบน แล้วตั้งเป็น <strong>"ทุกคนที่มีลิงก์มีสิทธิ์ดู"</strong> จะทำให้แดชบอร์ดซิงค์ตัวเลขสดตาม Google Sheet ได้ตลอดเวลาอัตโนมัติ
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Sync Confirmation Dialog (Explicit user confirmation required by workspace-integration guidelines) */}
          {showConfirmSync && (
            <div className="p-4 rounded-xl border border-amber-300 bg-amber-50 space-y-3 animate-in fade-in">
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-xs sm:text-sm text-slate-900">
                    ยืนยันการบันทึกข้อมูลทับลง Google Sheet?
                  </h5>
                  <p className="text-xs text-slate-600 mt-1">
                    ระบบจะเขียนข้อมูลทั้งหมด {totalRecordsCount} วัน ทั้งยอดขาย น้ำพริก เครื่องจักร และแพลตฟอร์ม ลงในสเปรดชีตของคุณ
                  </p>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowConfirmSync(false)}
                  className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleExecuteSync}
                  className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700"
                >
                  ยืนยันการบันทึก
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-right">
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
