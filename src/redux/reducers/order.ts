import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Quantity {
  id: string;
  quantity: number;
}

export interface OrderState {
  items: Quantity[];
  combos: Quantity[];
  services: Quantity[];
}

const initialState: OrderState = {
  items: [],
  combos: [],
  services: [],
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
    setServiceQuantity: (state, action: PayloadAction<Quantity>) => {
      const { id, quantity } = action.payload;
      const serviceIndex = state.services.findIndex((i) => i.id === id);
      if (serviceIndex !== -1) {
        state.services[serviceIndex].quantity = quantity;
      } else {
        state.services.push({ id, quantity });
      }
    },
    clearOrder: (state) => {
      state.items = [];
      state.combos = [];
      state.services = [];
    },
  },
});

export const { setItemQuantity, setComboQuantity, setServiceQuantity, clearOrder } = orderSlice.actions;
export default orderSlice.reducer;