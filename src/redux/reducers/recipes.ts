import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Quantity {
  id: string;
  quantity: number;
}

export interface RecipeState {
  items: Quantity[];
  ingredients: Quantity[];
}

const initialState: RecipeState = {
  items: [],
  ingredients: [],
};

export const recipesSlice = createSlice({
  name: 'Recipes',
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
    setIngredientQuantity: (state, action: PayloadAction<Quantity>) => {
      const { id, quantity } = action.payload;
      const comboIndex = state.ingredients.findIndex((i) => i.id === id);
      if (comboIndex !== -1) {
        state.ingredients[comboIndex].quantity = quantity;
      } else {
        state.ingredients.push({ id, quantity });
      }
    },
    clearRecipes: (state) => {
      state.items = [];
      state.ingredients = [];
    },
  },
});

export const { setItemQuantity, setIngredientQuantity, clearRecipes } = recipesSlice.actions;
export default recipesSlice.reducer;