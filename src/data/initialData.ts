import { DailySalesRecord } from '../types';

interface RawRow {
  date: string;
  month: 'sep' | 'oct' | 'nov' | 'dec';
  monthLabel: string;
  profit: number;
  margin: number;
  dayOfMonth: number;
  dayOfWeek: string;
}

const rawSeptData: RawRow[] = [
  { date: '1/9/69', month: 'sep', monthLabel: 'กันยายน 2569', profit: 8497, margin: 17.97, dayOfMonth: 1, dayOfWeek: 'อังคาร' },
  { date: '2/9/69', month: 'sep', monthLabel: 'กันยายน 2569', profit: 7207, margin: 17.74, dayOfMonth: 2, dayOfWeek: 'พุธ' },
  { date: '3/9/69', month: 'sep', monthLabel: 'กันยายน 2569', profit: 7628, margin: 17.63, dayOfMonth: 3, dayOfWeek: 'พฤหัสบดี' },
  { date: '4/9/69', month: 'sep', monthLabel: 'กันยายน 2569', profit: 5045, margin: 13.40, dayOfMonth: 4, dayOfWeek: 'ศุกร์' },
  { date: '5/9/69', month: 'sep', monthLabel: 'กันยายน 2569', profit: 6564, margin: 14.83, dayOfMonth: 5, dayOfWeek: 'เสาร์' },
  { date: '6/9/69', month: 'sep', monthLabel: 'กันยายน 2569', profit: 7527, margin: 17.26, dayOfMonth: 6, dayOfWeek: 'อาทิตย์' },
  { date: '7/9/69', month: 'sep', monthLabel: 'กันยายน 2569', profit: 8998, margin: 17.10, dayOfMonth: 7, dayOfWeek: 'จันทร์' },
  { date: '8/9/69', month: 'sep', monthLabel: 'กันยายน 2569', profit: 7217, margin: 17.21, dayOfMonth: 8, dayOfWeek: 'อังคาร' },
  { date: '9/9/69', month: 'sep', monthLabel: 'กันยายน 2569', profit: 6796, margin: 17.00, dayOfMonth: 9, dayOfWeek: 'พุธ' },
  { date: '10/9/69', month: 'sep', monthLabel: 'กันยายน 2569', profit: 6397, margin: 16.25, dayOfMonth: 10, dayOfWeek: 'พฤหัสบดี' },
  { date: '11/9/69', month: 'sep', monthLabel: 'กันยายน 2569', profit: 6206, margin: 17.11, dayOfMonth: 11, dayOfWeek: 'ศุกร์' },
  { date: '12/9/69', month: 'sep', monthLabel: 'กันยายน 2569', profit: 4409, margin: 15.78, dayOfMonth: 12, dayOfWeek: 'เสาร์' },
  { date: '13/9/69', month: 'sep', monthLabel: 'กันยายน 2569', profit: 5379, margin: 15.06, dayOfMonth: 13, dayOfWeek: 'อาทิตย์' },
  { date: '14/9/69', month: 'sep', monthLabel: 'กันยายน 2569', profit: 6448, margin: 17.14, dayOfMonth: 14, dayOfWeek: 'จันทร์' },
  { date: '15/9/69', month: 'sep', monthLabel: 'กันยายน 2569', profit: 6035, margin: 15.72, dayOfMonth: 15, dayOfWeek: 'อังคาร' },
  { date: '16/9/69', month: 'sep', monthLabel: 'กันยายน 2569', profit: 5159, margin: 15.64, dayOfMonth: 16, dayOfWeek: 'พุธ' },
  { date: '17/9/69', month: 'sep', monthLabel: 'กันยายน 2569', profit: 5966, margin: 18.01, dayOfMonth: 17, dayOfWeek: 'พฤหัสบดี' },
  { date: '18/9/69', month: 'sep', monthLabel: 'กันยายน 2569', profit: 4509, margin: 14.77, dayOfMonth: 18, dayOfWeek: 'ศุกร์' },
  { date: '19/9/69', month: 'sep', monthLabel: 'กันยายน 2569', profit: 4484, margin: 12.35, dayOfMonth: 19, dayOfWeek: 'เสาร์' },
  { date: '20/9/69', month: 'sep', monthLabel: 'กันยายน 2569', profit: 3609, margin: 11.14, dayOfMonth: 20, dayOfWeek: 'อาทิตย์' },
  { date: '21/9/69', month: 'sep', monthLabel: 'กันยายน 2569', profit: 6123, margin: 14.12, dayOfMonth: 21, dayOfWeek: 'จันทร์' },
  { date: '22/9/69', month: 'sep', monthLabel: 'กันยายน 2569', profit: 5519, margin: 13.77, dayOfMonth: 22, dayOfWeek: 'อังคาร' },
  { date: '23/9/69', month: 'sep', monthLabel: 'กันยายน 2569', profit: 4751, margin: 13.96, dayOfMonth: 23, dayOfWeek: 'พุธ' },
  { date: '24/9/69', month: 'sep', monthLabel: 'กันยายน 2569', profit: 6322, margin: 14.93, dayOfMonth: 24, dayOfWeek: 'พฤหัสบดี' },
  { date: '25/9/69', month: 'sep', monthLabel: 'กันยายน 2569', profit: 6857, margin: 16.25, dayOfMonth: 25, dayOfWeek: 'ศุกร์' },
  { date: '26/9/69', month: 'sep', monthLabel: 'กันยายน 2569', profit: 6878, margin: 15.00, dayOfMonth: 26, dayOfWeek: 'เสาร์' },
  { date: '27/9/69', month: 'sep', monthLabel: 'กันยายน 2569', profit: 8856, margin: 15.43, dayOfMonth: 27, dayOfWeek: 'อาทิตย์' },
  { date: '28/9/69', month: 'sep', monthLabel: 'กันยายน 2569', profit: 7353, margin: 15.59, dayOfMonth: 28, dayOfWeek: 'จันทร์' },
  { date: '29/9/69', month: 'sep', monthLabel: 'กันยายน 2569', profit: 5618, margin: 13.88, dayOfMonth: 29, dayOfWeek: 'อังคาร' },
  { date: '30/9/69', month: 'sep', monthLabel: 'กันยายน 2569', profit: 0, margin: 0, dayOfMonth: 30, dayOfWeek: 'พุธ' },
];

const rawOctData: RawRow[] = [
  { date: '1/10/69', month: 'oct', monthLabel: 'ตุลาคม 2569', profit: 118, margin: 5.90, dayOfMonth: 1, dayOfWeek: 'พฤหัสบดี' },
  { date: '2/10/69', month: 'oct', monthLabel: 'ตุลาคม 2569', profit: 560, margin: 18.67, dayOfMonth: 2, dayOfWeek: 'ศุกร์' },
];

const rawNovData: RawRow[] = [
  { date: '1/11/69', month: 'nov', monthLabel: 'พฤศจิกายน 2569', profit: 118, margin: 5.90, dayOfMonth: 1, dayOfWeek: 'อาทิตย์' },
  { date: '2/11/69', month: 'nov', monthLabel: 'พฤศจิกายน 2569', profit: 180, margin: 12.00, dayOfMonth: 2, dayOfWeek: 'จันทร์' },
];

const rawDecData: RawRow[] = [
  { date: '1/12/69', month: 'dec', monthLabel: 'ธันวาคม 2569', profit: 118, margin: 5.90, dayOfMonth: 1, dayOfWeek: 'อังคาร' },
  { date: '2/12/69', month: 'dec', monthLabel: 'ธันวาคม 2569', profit: 180, margin: 12.00, dayOfMonth: 2, dayOfWeek: 'พุธ' },
];

function transformRowToDailyRecord(row: RawRow, index: number): DailySalesRecord {
  const profit = row.profit;
  const marginPct = row.margin;
  const revenue = marginPct > 0 ? Math.round(profit / (marginPct / 100)) : 0;
  
  // Estimate ad spend (typically 12-18% of revenue in e-commerce)
  const adSpend = Math.round(revenue * 0.14);

  // Chili paste: steady high-volume consumer goods (~62% of revenue on average)
  // Machinery: high-ticket value, higher margin (~38% of revenue on average)
  const chiliRatio = profit > 0 ? (0.58 + (index % 5) * 0.02) : 0.6;
  const machineRatio = 1 - chiliRatio;

  const chiliRev = Math.round(revenue * chiliRatio);
  const machineRev = revenue - chiliRev;

  // Chili net profit margin typically 14% - 17%
  // Machinery net profit margin typically 16% - 22%
  const chiliProfit = Math.round(profit * (chiliRatio * 0.95));
  const machineProfit = profit - chiliProfit;

  const chiliMargin = chiliRev > 0 ? Number(((chiliProfit / chiliRev) * 100).toFixed(2)) : 0;
  const machineMargin = machineRev > 0 ? Number(((machineProfit / machineRev) * 100).toFixed(2)) : 0;

  // Platform Distribution (เฉพาะ 3 ช่องทางหลักที่ร้านค้าใช้จริง: TikTok, Shopee, เพจตรง/Line OA)
  // TikTok: 52% (เน้นขายน้ำพริก, ไลฟ์สด, วิดีโอสั้น, แอฟฟิลิเอต)
  // Shopee: 33% (ร้านค้าหลัก ค้นหาสินค้า อุปกรณ์ และสั่งซื้อซ้ำ)
  // Direct: 15% (เพจ Facebook, Line OA, ปิดการขายเครื่องจักร & ขายส่งยกลัง)
  const tiktokRev = Math.round(revenue * 0.52);
  const shopeeRev = Math.round(revenue * 0.33);
  const directRev = Math.max(0, revenue - (tiktokRev + shopeeRev));

  const tiktokProfit = Math.round(profit * 0.48);
  const shopeeProfit = Math.round(profit * 0.34);
  const directProfit = Math.max(0, profit - (tiktokProfit + shopeeProfit));

  const tiktokAd = Math.round(adSpend * 0.55);
  const shopeeAd = Math.round(adSpend * 0.32);
  const directAd = Math.max(0, adSpend - (tiktokAd + shopeeAd));

  const avgOrderVal = 320; // Average chili order ~320 baht, machine parts higher
  const estimatedOrders = revenue > 0 ? Math.max(1, Math.round(revenue / avgOrderVal)) : 0;

  return {
    id: `rec-${row.month}-${row.dayOfMonth}`,
    date: row.date,
    dateObj: `2026-${row.month === 'sep' ? '09' : row.month === 'oct' ? '10' : row.month === 'nov' ? '11' : '12'}-${String(row.dayOfMonth).padStart(2, '0')}`,
    month: row.month,
    monthLabel: row.monthLabel,
    dayOfMonth: row.dayOfMonth,
    dayOfWeek: row.dayOfWeek,

    totalRevenue: revenue,
    totalNetProfit: profit,
    totalAdSpend: adSpend,
    marginPercent: marginPct,

    chili: {
      revenue: chiliRev,
      netProfit: chiliProfit,
      marginPercent: chiliMargin,
      adSpend: Math.round(adSpend * chiliRatio),
      orders: Math.round(estimatedOrders * 0.85),
    },
    machine: {
      revenue: machineRev,
      netProfit: machineProfit,
      marginPercent: machineMargin,
      adSpend: Math.round(adSpend * machineRatio),
      orders: Math.max(1, Math.round(estimatedOrders * 0.15)),
    },

    platforms: {
      tiktok: {
        revenue: tiktokRev,
        netProfit: tiktokProfit,
        adSpend: tiktokAd,
        orders: Math.round(estimatedOrders * 0.55),
      },
      shopee: {
        revenue: shopeeRev,
        netProfit: shopeeProfit,
        adSpend: shopeeAd,
        orders: Math.round(estimatedOrders * 0.35),
      },
      direct: {
        revenue: directRev,
        netProfit: directProfit,
        adSpend: directAd,
        orders: Math.max(1, Math.round(estimatedOrders * 0.10)),
      },
    },
  };
}

export const INITIAL_SALES_DATA: DailySalesRecord[] = [
  ...rawSeptData.map(transformRowToDailyRecord),
  ...rawOctData.map(transformRowToDailyRecord),
  ...rawNovData.map(transformRowToDailyRecord),
  ...rawDecData.map(transformRowToDailyRecord),
];
