import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Quantity } from "./order";

export interface ReceiptsState {
  receipts: Receipt[];
}

export interface Receipt {
  id?: string;
  employee: string;
  shift: string;
  items: Quantity[];
  combos: Quantity[];
  total: number;
  date: string;
  tip: number;
}

const initialState: ReceiptsState = {
  receipts: []
};

export const profile = createSlice({
  name: 'Receipts',
  initialState: initialState,
  reducers: {
    setReceipts: (state, action: PayloadAction<Receipt[]>) => {
      state.receipts = action.payload;
    },
    addReceipt: (state, action: PayloadAction<Receipt>) => {
      state.receipts.push(action.payload);
    },
    updateReceipt: (state, action: PayloadAction<Receipt>) => {
      const index = state.receipts.findIndex(receipt => receipt.id === action.payload.id);
      if (index !== -1) {
        state.receipts[index] = action.payload;
      }
    },
  },
});

export const { setReceipts, addReceipt, updateReceipt } = profile.actions;
export default profile.reducer;