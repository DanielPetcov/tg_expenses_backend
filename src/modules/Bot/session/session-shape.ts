import { ReceiptResponse } from 'src/modules/Ai/models/receipt-response.model';

export interface SessionData {
  lastListMessageId?: number;
  pendingReceipt?: ReceiptResponse[];
}

export function initial(): SessionData {
  return {};
}
