import { Ingredient } from "../reducers/menuItems";
import { RootState } from "../store";

export function getIngredientById(state: RootState, id: string): Ingredient | undefined {
  return state.ingredients.items.find(ingredient => ingredient.id === id);
}