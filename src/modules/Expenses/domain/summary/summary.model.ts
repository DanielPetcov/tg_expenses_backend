export interface CategoryBreakdown {
  [category: string]: number;
}

export interface TopMerchant {
  name: string;
  total: number;
}

export interface LargestExpense {
  amount: number;
  category: string;
  merchant?: string;
  date: string;
}

export interface MonthlySummary {
  year: number;
  month: number;
  totalAmount: number;
  transactionCount: number;
  dailyAverage: number;
  categoryBreakdown: CategoryBreakdown;
  topMerchants: TopMerchant[];
  largestExpense: LargestExpense;
  recurringTotal: number;
  // computed, not stored
  topCategory: string;
  topCategoryAmount: number;
}
