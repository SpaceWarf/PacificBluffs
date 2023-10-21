import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Ingredient } from "./menuItems";

export interface IngredientsState {
  items: Ingredient[];
}

const initialState: IngredientsState = {
  items: [],
};

export const ingredients = createSlice({
  name: 'Ingredients',
  initialState: initialState,
  reducers: {
    setIngredients: (state, action: PayloadAction<Ingredient[]>) => {
      state.items = action.payload;
    },
    setIngredientStock: (state, action: PayloadAction<{ id: string, stock: number }>) => {
      state.items = state.items.map((item) => {
        if (item.id === action.payload.id) {
          return { ...item, stock: action.payload.stock };
        }
        return item;
      });
    },
  },
});

export const { setIngredients, setIngredientStock } = ingredients.actions;
export default ingredients.reducer;