export interface ReceiptItem {
  name: string;
  amount: number;
}

export interface ReceiptResponse {
  merchant: string;
  date: string;
  items: ReceiptItem[];
  total: number;
  category:
    | 'food'
    | 'transport'
    | 'health'
    | 'utilities'
    | 'shopping'
    | 'entertainment'
    | 'other';
}
