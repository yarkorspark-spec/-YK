export type CategoryType = 'all' | 'chili' | 'machine';
export type PlatformType = 'all' | 'tiktok' | 'shopee' | 'direct';
export type MonthFilter = 'all' | 'sep' | 'oct' | 'nov' | 'dec';

export interface PlatformStat {
  revenue: number;
  netProfit: number;
  adSpend: number;
  orders: number;
}

export interface DailySalesRecord {
  id: string;
  date: string; // e.g. "1/9/69"
  dateObj: string; // ISO date string "2026-09-01"
  month: 'sep' | 'oct' | 'nov' | 'dec';
  monthLabel: string;
  dayOfMonth: number;
  dayOfWeek: string; // "จันทร์", "อังคาร", etc.
  
  // Overall
  totalRevenue: number;
  totalNetProfit: number;
  totalAdSpend: number;
  marginPercent: number; // e.g. 17.97

  // By Category
  chili: {
    revenue: number;
    netProfit: number;
    marginPercent: number;
    adSpend: number;
    orders: number;
  };
  machine: {
    revenue: number;
    netProfit: number;
    marginPercent: number;
    adSpend: number;
    orders: number;
  };

  // By Platform (เฉพาะช่องทางที่มีจริง: TikTok Shop, Shopee, เพจตรง / Line OA)
  platforms: {
    tiktok: PlatformStat;
    shopee: PlatformStat;
    direct: PlatformStat; // เพจ Facebook, Line OA, หน้าโรงงาน/B2B
  };
}

export interface GoogleSheetSyncState {
  isConnected: boolean;
  spreadsheetId: string | null;
  spreadsheetUrl: string | null;
  spreadsheetTitle: string;
  lastSyncedAt: string | null;
  isSyncing: boolean;
  error: string | null;
  autoSyncEnabled: boolean;
  syncIntervalSeconds: number;
}
