import { Receipt } from "../reducers/receipts";
import { RootState } from "../store";
import { getCurrentShift } from "./shifts";

export function getReceiptsForCurrentShift(state: RootState): Receipt[] {
  const shift = getCurrentShift(state);
  if (shift) {
    return state.receipts.receipts.filter(receipt => receipt.shift === shift.id);
  }
  return [];
}

export function getBiggestReceipts(state: RootState): Receipt[] {
  const receipts = [ ...state.receipts.receipts ];
  return receipts
    .filter(receipt => receipt.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);
}

export function getBiggestTipReceipts(state: RootState): Receipt[] {
  const receipts = [ ...state.receipts.receipts ];
  return receipts
    .filter(receipt => receipt.tip > 0)
    .sort((a, b) => b.tip - a.tip)
    .slice(0, 10);
}

export function getReceiptsForLastWeek(state: RootState): Receipt[] {
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  return state.receipts.receipts.filter(receipt => new Date(receipt.date) > lastWeek);
}

export function getLifetimeProfits(state: RootState): number {
  return state.receipts.receipts.reduce((total, receipt) => total + receipt.total + receipt.tip, 0);
}

export function getLifetimeTips(state: RootState): number {
  return state.receipts.receipts.reduce((total, receipt) => total + receipt.tip, 0);
}