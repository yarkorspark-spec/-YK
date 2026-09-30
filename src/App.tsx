import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { User } from 'firebase/auth';
import { 
  initAuth, 
  googleSignIn, 
  logout, 
  getAccessToken 
} from './services/firebaseAuth';
import { 
  createGoogleSheet, 
  populateInitialData, 
  appendDailyRecord, 
  fetchSheetMetadata,
  fetchSpreadsheetData,
  loadStoredSheetConfig,
  saveStoredSheetConfig,
  loadStoredRecords,
  saveStoredRecords,
} from './services/sheetsService';
import { INITIAL_SALES_DATA } from './data/initialData';
import { 
  DailySalesRecord, 
  CategoryType, 
  PlatformType, 
  MonthFilter, 
  GoogleSheetSyncState 
} from './types';

import { Navbar } from './components/Navbar';
import { FilterBar } from './components/FilterBar';
import { KPICards } from './components/KPICards';
import { TrendChart } from './components/TrendChart';
import { CategoryComparison } from './components/CategoryComparison';
import { PlatformBreakdown } from './components/PlatformBreakdown';
import { MarketingInsights } from './components/MarketingInsights';
import { DataTableModal } from './components/DataTableModal';
import { AddRecordModal } from './components/AddRecordModal';
import { GoogleSheetModal } from './components/GoogleSheetModal';
import { 
  Sparkles, 
  FileSpreadsheet, 
  CheckCircle2, 
  TrendingUp, 
  Layers, 
  HelpCircle,
  TableProperties,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

export default function App() {
  // Authentication state
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Restore stored Google Sheet configuration from localStorage (เชื่อมต่อครั้งเดียว)
  const [syncState, setSyncState] = useState<GoogleSheetSyncState>(() => {
    const stored = loadStoredSheetConfig();
    return {
      isConnected: Boolean(stored?.spreadsheetId),
      spreadsheetId: stored?.spreadsheetId || null,
      spreadsheetUrl: stored?.spreadsheetUrl || null,
      spreadsheetTitle: stored?.spreadsheetTitle || '',
      lastSyncedAt: stored?.lastSyncedAt || null,
      isSyncing: false,
      error: null,
      autoSyncEnabled: stored?.autoSyncEnabled !== undefined ? stored.autoSyncEnabled : true,
      syncIntervalSeconds: 20,
    };
  });

  // Sales Records state (restore from localStorage cache if available)
  const [records, setRecords] = useState<DailySalesRecord[]>(() => {
    const cached = loadStoredRecords();
    return cached && cached.length > 0 ? cached : INITIAL_SALES_DATA;
  });

  const prevRecordsRef = React.useRef<DailySalesRecord[]>(records);

  // Filter states
  const [category, setCategory] = useState<CategoryType>('all');
  const [platform, setPlatform] = useState<PlatformType>('all');
  const [month, setMonth] = useState<MonthFilter>('all');

  // Modals
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSheetModalOpen, setIsSheetModalOpen] = useState(false);

  // Success toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Auth Initialization
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser) => {
        setUser(currentUser);
      },
      () => {
        setUser(null);
      }
    );
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleSignIn = async () => {
    setIsLoggingIn(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        showToast(`ยินดีต้อนรับ ${res.user.displayName || res.user.email}`);
      }
    } catch (err: any) {
      console.error(err);
      alert('เข้าสู่ระบบไม่สำเร็จ: ' + (err.message || 'เกิดข้อผิดพลาด'));
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    setUser(null);
    showToast('ออกจากระบบเรียบร้อยแล้ว');
  };

  // Pull latest data from connected Google Sheet
  const handlePullDataFromSheet = useCallback(async (silent = false) => {
    if (!syncState.spreadsheetId) return;

    if (!silent) {
      setSyncState((prev) => ({ ...prev, isSyncing: true }));
    }

    try {
      const token = await getAccessToken();
      const updated = await fetchSpreadsheetData(token, syncState.spreadsheetId);
      if (updated && updated.length > 0) {
        const isDataChanged = JSON.stringify(updated) !== JSON.stringify(prevRecordsRef.current);
        if (isDataChanged) {
          setRecords(updated);
          prevRecordsRef.current = updated;
          saveStoredRecords(updated);
          if (silent) {
            showToast(`⚡ ซิงค์สดเรียลไทม์: ตรวจพบข้อมูลล่าสุดจาก Google Sheet (${updated.length} วัน)`);
          }
        }

        const nowStr = new Date().toLocaleTimeString('th-TH');
        setSyncState((prev) => {
          const next = {
            ...prev,
            lastSyncedAt: nowStr,
            isSyncing: false,
            error: null,
          };
          saveStoredSheetConfig({
            spreadsheetId: prev.spreadsheetId!,
            spreadsheetUrl: prev.spreadsheetUrl || '',
            spreadsheetTitle: prev.spreadsheetTitle || '',
            lastSyncedAt: nowStr,
            autoSyncEnabled: prev.autoSyncEnabled,
          });
          return next;
        });

        if (!silent) {
          showToast(`ซิงค์ข้อมูลล่าสุดจาก Google Sheet สำเร็จ (${updated.length} รายการ)`);
        }
      } else {
        setSyncState((prev) => ({ ...prev, isSyncing: false }));
      }
    } catch (err: any) {
      console.warn('Real-time sync fetch notice:', err);
      setSyncState((prev) => ({ ...prev, isSyncing: false, error: err.message }));
    }
  }, [syncState.spreadsheetId]);

  // Automated Real-time Sync Interval & Window Focus Hook
  useEffect(() => {
    if (!syncState.spreadsheetId || !syncState.autoSyncEnabled) return;

    // Trigger on initial connection
    handlePullDataFromSheet(true);

    // Periodic timer (every X seconds)
    const intervalTime = Math.max(10, syncState.syncIntervalSeconds) * 1000;
    const timer = setInterval(() => {
      handlePullDataFromSheet(true);
    }, intervalTime);

    // Sync immediately when user switches back from Google Sheets window/tab
    const onWindowFocus = () => {
      handlePullDataFromSheet(true);
    };
    window.addEventListener('focus', onWindowFocus);
    document.addEventListener('visibilitychange', onWindowFocus);

    return () => {
      clearInterval(timer);
      window.removeEventListener('focus', onWindowFocus);
      document.removeEventListener('visibilitychange', onWindowFocus);
    };
  }, [syncState.spreadsheetId, syncState.autoSyncEnabled, syncState.syncIntervalSeconds, handlePullDataFromSheet]);

  // Google Sheet creation
  const handleCreateNewSheet = async () => {
    let token = await getAccessToken();
    if (!token) {
      const res = await googleSignIn();
      if (!res) return;
      token = res.accessToken;
      setUser(res.user);
    }

    const result = await createGoogleSheet(token, 'แดชบอร์ดยอดขาย น้ำพริก & เครื่องจักร 2569', records);
    const nowStr = new Date().toLocaleTimeString('th-TH');
    const newConfig = {
      isConnected: true,
      spreadsheetId: result.spreadsheetId,
      spreadsheetUrl: result.spreadsheetUrl,
      spreadsheetTitle: result.title,
      lastSyncedAt: nowStr,
      isSyncing: false,
      error: null,
      autoSyncEnabled: true,
      syncIntervalSeconds: 20,
    };

    setSyncState(newConfig);
    saveStoredSheetConfig({
      spreadsheetId: result.spreadsheetId,
      spreadsheetUrl: result.spreadsheetUrl,
      spreadsheetTitle: result.title,
      lastSyncedAt: nowStr,
      autoSyncEnabled: true,
    });
    saveStoredRecords(records);
    showToast('สร้าง Google Sheet ใหม่และเชื่อมต่อเรียลไทม์สำเร็จแล้ว!');
  };

  const handleConnectExistingSheet = async (idOrUrl: string) => {
    // Extract ID if URL passed
    let sheetId = idOrUrl.trim();
    const match = idOrUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      sheetId = match[1];
    }

    let token = await getAccessToken();
    let title = 'Google Sheet (ยอดขาย)';

    if (!token && !user) {
      try {
        const res = await googleSignIn();
        if (res) {
          token = res.accessToken;
          setUser(res.user);
        }
      } catch (err) {
        console.warn('Sign-in skipped or cancelled, attempting public access fallback:', err);
      }
    }

    if (token) {
      try {
        const meta = await fetchSheetMetadata(token, sheetId);
        title = meta.title;
      } catch (err) {
        console.warn('Metadata fetch notice:', err);
      }
    }

    // Try fetching initial rows immediately
    const updated = await fetchSpreadsheetData(token, sheetId);
    if (!updated || updated.length === 0) {
      if (!token) {
        throw new Error(
          'ไม่สามารถเปิดสเปรดชีตนี้ได้: โปรดแตะ "เข้าสู่ระบบ Google" หรือใน Google Sheet ให้ตั้งค่าแชร์เป็น "ทุกคนที่มีลิงก์มีสิทธิ์ดู"'
        );
      }
    }

    const nowStr = new Date().toLocaleTimeString('th-TH');
    const newConfig = {
      isConnected: true,
      spreadsheetId: sheetId,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${sheetId}/edit`,
      spreadsheetTitle: title,
      lastSyncedAt: nowStr,
      isSyncing: false,
      error: null,
      autoSyncEnabled: true,
      syncIntervalSeconds: 15,
    };

    setSyncState(newConfig);
    saveStoredSheetConfig({
      spreadsheetId: sheetId,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${sheetId}/edit`,
      spreadsheetTitle: title,
      lastSyncedAt: nowStr,
      autoSyncEnabled: true,
    });

    if (updated && updated.length > 0) {
      setRecords(updated);
      prevRecordsRef.current = updated;
      saveStoredRecords(updated);
    }

    showToast(`เชื่อมต่อ Google Sheet: "${title}" เรียบร้อยแล้ว (เปิดซิงค์สดเรียลไทม์)`);
  };

  const handleSyncAllData = async () => {
    let token = await getAccessToken();
    if (!token) {
      const res = await googleSignIn();
      if (!res) return;
      token = res.accessToken;
      setUser(res.user);
    }
    if (!syncState.spreadsheetId) return;

    await populateInitialData(token, syncState.spreadsheetId, records);
    const nowStr = new Date().toLocaleTimeString('th-TH');
    setSyncState((prev) => ({
      ...prev,
      lastSyncedAt: nowStr,
    }));
    saveStoredSheetConfig({
      spreadsheetId: syncState.spreadsheetId,
      spreadsheetUrl: syncState.spreadsheetUrl || '',
      spreadsheetTitle: syncState.spreadsheetTitle || '',
      lastSyncedAt: nowStr,
      autoSyncEnabled: syncState.autoSyncEnabled,
    });
    showToast('อัปเดตข้อมูลทั้งหมดลง Google Sheet เรียบร้อยแล้ว!');
  };

  const handleSaveNewRecord = async (newRecord: DailySalesRecord) => {
    const updatedRecords = [newRecord, ...records];
    setRecords(updatedRecords);
    saveStoredRecords(updatedRecords);
    showToast(`บันทึกยอดขายวันที่ ${newRecord.date} เรียบร้อยแล้ว`);

    // If Google Sheet is connected, append row to Google Sheet
    const token = await getAccessToken();
    if (token && syncState.spreadsheetId) {
      try {
        await appendDailyRecord(token, syncState.spreadsheetId, newRecord);
        showToast(`บันทึกลง Google Sheet เรียบร้อยแล้ว!`);
      } catch (err) {
        console.error('Failed to append to sheet:', err);
      }
    }
  };

  const handleToggleAutoSync = (enabled: boolean) => {
    setSyncState((prev) => {
      const next = { ...prev, autoSyncEnabled: enabled };
      if (prev.spreadsheetId) {
        saveStoredSheetConfig({
          spreadsheetId: prev.spreadsheetId,
          spreadsheetUrl: prev.spreadsheetUrl || '',
          spreadsheetTitle: prev.spreadsheetTitle || '',
          lastSyncedAt: prev.lastSyncedAt || '',
          autoSyncEnabled: enabled,
        });
      }
      return next;
    });
    showToast(enabled ? 'เปิดระบบซิงค์สดเรียลไทม์แล้ว' : 'ปิดระบบซิงค์สดอัตโนมัติแล้ว');
  };

  const handleChangeSyncInterval = (seconds: number) => {
    setSyncState((prev) => ({ ...prev, syncIntervalSeconds: seconds }));
    showToast(`ปรับความถี่ซิงค์เป็นทุก ${seconds} วินาที`);
  };

  const handleDisconnectSheet = () => {
    saveStoredSheetConfig(null);
    setSyncState({
      isConnected: false,
      spreadsheetId: null,
      spreadsheetUrl: null,
      spreadsheetTitle: '',
      lastSyncedAt: null,
      isSyncing: false,
      error: null,
      autoSyncEnabled: true,
      syncIntervalSeconds: 20,
    });
    showToast('ยกเลิกการเชื่อมต่อชีตเรียบร้อยแล้ว');
  };

  // Filter records by Month
  const filteredRecords = useMemo(() => {
    if (month === 'all') return records;
    return records.filter((r) => r.month === month);
  }, [records, month]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-rose-500 selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2.5 animate-in slide-in-from-bottom-3 duration-200 text-xs sm:text-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        user={user}
        syncState={syncState}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenTableModal={() => setIsTableModalOpen(true)}
        onOpenSheetModal={() => setIsSheetModalOpen(true)}
        onManualSync={() => handlePullDataFromSheet(false)}
        isLoggingIn={isLoggingIn}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Banner: Google Sheets Quick Banner */}
        {!syncState.spreadsheetId ? (
          <div className="bg-linear-to-r from-emerald-600 to-teal-700 rounded-2xl p-4 sm:p-5 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
                <FileSpreadsheet className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm sm:text-base">
                  เชื่อมต่อ Google Sheets เพียงครั้งเดียว แล้วซิงค์สดเรียลไทม์ได้ตลอด
                </h4>
                <p className="text-xs text-emerald-100">
                  ระบบจะจดจำสเปรดชีตของคุณไว้ถาวร เมื่อคุณแก้ไขตัวเลขใน Google Sheet แดชบอร์ดจะอัปเดตให้อัตโนมัติทันที
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsSheetModalOpen(true)}
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors shrink-0"
            >
              <span>เชื่อมต่อ Google Sheets ทันที</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="bg-linear-to-r from-emerald-950 via-slate-900 to-slate-900 rounded-2xl p-3.5 sm:p-4 text-white shadow-sm border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    ⚡ ซิงค์เรียลไทม์ตาม Google Sheet อัตโนมัติ (เชื่อมต่อถาวร)
                  </span>
                  {syncState.spreadsheetUrl && (
                    <a
                      href={syncState.spreadsheetUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-slate-300 hover:text-white underline inline-flex items-center gap-0.5"
                    >
                      <span>{syncState.spreadsheetTitle || 'เปิด Google Sheet'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  ตรวจจับการแก้ไขตัวเลขในสเปรดชีตทุก {syncState.syncIntervalSeconds} วินาที และทุกครั้งที่สลับหน้าจอกลับมา
                  {syncState.lastSyncedAt && ` • ซิงค์ล่าสุดเมื่อ ${syncState.lastSyncedAt}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              <button
                onClick={() => handlePullDataFromSheet(false)}
                disabled={syncState.isSyncing}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/90 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                title="ดึงข้อมูลจาก Google Sheet ตอนนี้ทันที"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncState.isSyncing ? 'animate-spin' : ''}`} />
                <span>{syncState.isSyncing ? 'กำลังซิงค์...' : 'ซิงค์ทันที'}</span>
              </button>

              <button
                onClick={() => setIsSheetModalOpen(true)}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium border border-slate-700 transition-colors"
              >
                จัดการชีต
              </button>
            </div>
          </div>
        )}

        {/* Filter Controls (Category, Platform, Month) */}
        <FilterBar
          selectedCategory={category}
          onSelectCategory={setCategory}
          selectedPlatform={platform}
          onSelectPlatform={setPlatform}
          selectedMonth={month}
          onSelectMonth={setMonth}
        />

        {/* Executive KPI Summary Cards */}
        <KPICards
          records={filteredRecords}
          category={category}
          platform={platform}
        />

        {/* Trend Area Chart (Daily Sales & Profit) */}
        <TrendChart
          records={filteredRecords}
          category={category}
          platform={platform}
        />

        {/* Category Breakdown (น้ำพริก VS เครื่องจักร) */}
        <CategoryComparison
          records={filteredRecords}
        />

        {/* Platform Breakdown & Take Rate Comparison */}
        <PlatformBreakdown
          records={filteredRecords}
          activePlatform={platform}
          onSelectPlatform={setPlatform}
        />

        {/* Strategic Marketing Insights & Budget Simulator */}
        <MarketingInsights
          records={filteredRecords}
        />

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2569 แดชบอร์ดยอดขายและกำไร | ธุรกิจน้ำพริก & เครื่องจักรแปรรูปอาหาร</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsTableModalOpen(true)}
              className="hover:text-slate-900 transition-colors"
            >
              ดูตารางข้อมูล
            </button>
            <button
              onClick={() => setIsSheetModalOpen(true)}
              className="hover:text-slate-900 transition-colors"
            >
              ระบบ Google Sheets
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <DataTableModal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
        records={records}
        spreadsheetUrl={syncState.spreadsheetUrl}
      />

      <AddRecordModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveNewRecord}
        isSheetConnected={Boolean(syncState.spreadsheetId)}
      />

      <GoogleSheetModal
        isOpen={isSheetModalOpen}
        onClose={() => setIsSheetModalOpen(false)}
        user={user}
        syncState={syncState}
        onSignIn={handleSignIn}
        onCreateNewSheet={handleCreateNewSheet}
        onConnectExistingSheet={handleConnectExistingSheet}
        onSyncAllData={handleSyncAllData}
        onPullDataFromSheet={() => handlePullDataFromSheet(false)}
        onToggleAutoSync={handleToggleAutoSync}
        onChangeSyncInterval={handleChangeSyncInterval}
        onDisconnectSheet={handleDisconnectSheet}
        totalRecordsCount={records.length}
      />

    </div>
  );
}
