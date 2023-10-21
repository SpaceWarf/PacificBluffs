import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Quantity {
  id: string;
  quantity: number;
}

export interface OrderState {
  items: Quantity[];
  combos: Quantity[];
}

const initialState: OrderState = {
  items: [],
  combos: [],
};

export const orderSlice = createSlice({
  name: 'Order',
  initialState: initialState,
  reducers: {
    setItemQuantity: (state, action: PayloadAction<Quantity>) => {
      const { id, quantity } = action.payload;
      const itemIndex = state.items.findIndex((i) => i.id === id);
      if (itemIndex !== -1) {
        state.items[itemIndex].quantity = quantity;
      } else {
        state.items.push({ id, quantity });
      }
    },
    setComboQuantity: (state, action: PayloadAction<Quantity>) => {
      const { id, quantity } = action.payload;
      const comboIndex = state.combos.findIndex((i) => i.id === id);
      if (comboIndex !== -1) {
        state.combos[comboIndex].quantity = quantity;
      } else {
        state.combos.push({ id, quantity });
      }
    },
    clearOrder: (state) => {
      state.items = [];
      state.combos = [];
    },
  },
});

export const { setItemQuantity, setComboQuantity, clearOrder } = orderSlice.actions;
export default orderSlice.reducer;