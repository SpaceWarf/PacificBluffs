import { cloneDeep } from "lodash";
import { Quantity } from "../reducers/recipes";
import { RootState } from "../store";
import { getIngredientById } from "./ingredients";
import { getMenuItemById } from "./menuItems";

export interface RecipeItem {
  id: string;
  name: string;
  quantity: number;
  recipe?: RecipeItem[];
}

export function getAllRecipeIngredients(state: RootState): RecipeItem[] {
  const ingredients: Quantity[] = cloneDeep(state.recipes.ingredients);

  getIngredientsForMenuItems(state).forEach((ingredientQty: Quantity) => {
    pushOrAdd(ingredients, ingredientQty);
  });

  return processIngredientsForIngredientList(state, ingredients, 1);
}

export function getIngredientsForMenuItems(state: RootState): Quantity[] {
  const ingredients: Quantity[] = [];
  cloneDeep(state.recipes.items).forEach((itemQty: Quantity) => {
    const menuItem = getMenuItemById(state, itemQty.id);
    
    if (menuItem && menuItem.recipe) {
      menuItem.recipe.forEach((ingredientQty: Quantity) => {
        ingredients.push({
          ...ingredientQty,
          quantity: itemQty.quantity * ingredientQty.quantity
        });
      });
    }
  });
  return ingredients;
}

export function processIngredientsForIngredientList(
  state: RootState,
  ingredients: Quantity[],
  multiplier: number,
): RecipeItem[] {
  const processedIngredients: RecipeItem[] = [];

  ingredients.forEach((ingredientQty: Quantity) => {
    if (ingredientQty.quantity > 0) {
      const ingredient = getIngredientById(state, ingredientQty.id);

      if (ingredient && ingredient.recipe) {
        const recipe = processIngredientsForIngredientList(
          state,
          cloneDeep(ingredient.recipe),
          ingredientQty.quantity * multiplier,
        );
        pushOrAdd(
          processedIngredients,
          {
            id: ingredient.id,
            name: ingredient.name,
            quantity: ingredientQty.quantity * multiplier,
            recipe,
          }
        );
      } else if (ingredient) {
        pushOrAdd(
          processedIngredients,
          {
            id: ingredient.id,
            name: ingredient.name,
            quantity: ingredientQty.quantity * multiplier,
          }
        )
      }
    }
  });

  return processedIngredients;
}

function pushOrAdd(array: (Quantity | RecipeItem)[], item: Quantity | RecipeItem) {
  const index = array.findIndex(i => i.id === item.id);
  if (index === -1) {
    array.push(item);
  } else {
    array[index].quantity += item.quantity;
  }
}
