import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum MenuItemType {
  FOOD = "food",
  DRINK = "drinks"
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  stock: number;
  recipe: RecipeItem[];
  type: MenuItemType;
}

export interface RecipeItem {
  id: string;
  quantity: number;
}

export interface Combo {
  id: string;
  name: string;
  price: number;
  items: ComboItem[];
}

export interface ComboItem {
  id: string;
  quantity: number;
}

export interface Ingredient {
  id: string;
  name: string;
  stock: number;
  complex: boolean;
  recipe?: RecipeItem[];
}

export interface MenuItemsState {
  items: MenuItem[];
  combos: Combo[];
}

const initialState: MenuItemsState = {
  items: [],
  combos: [],
};

export const menuItems = createSlice({
  name: 'MenuItems',
  initialState: initialState,
  reducers: {
    setMenuItems: (state, action: PayloadAction<MenuItem[]>) => {
      state.items = action.payload;
    },
    setCombos: (state, action: PayloadAction<Combo[]>) => {
      state.combos = action.payload;
    },
    setMenuItemStock: (state, action: PayloadAction<{ id: string, stock: number }>) => {
      const { id, stock } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.stock = stock;
      }
    },
  },
});

export const { setMenuItems, setCombos, setMenuItemStock } = menuItems.actions;
export default menuItems.reducer;