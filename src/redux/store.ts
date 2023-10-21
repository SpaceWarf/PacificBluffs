import { AnyAction, combineReducers, configureStore } from "@reduxjs/toolkit";
import orderReducer from "./reducers/order";
import menuItemsReducer from "./reducers/menuItems";
import ingredientsReducer from "./reducers/ingredients";
import profileReducer from "./reducers/profile";
import shiftsReducer from './reducers/shifts';
import receiptsReducer from './reducers/receipts';
import recipesReducer from './reducers/recipes';
import menusAndAdsReducer from './reducers/menusAndAds';
import divisions from "./reducers/divisions";
import roles from "./reducers/roles";

const rootReducer = (state: any, action: AnyAction) => {
  if (action.type === 'RESET') {
    state = {};
  }

  return combineReducers({
    order: orderReducer,
    menuItems: menuItemsReducer,
    ingredients: ingredientsReducer,
    profile: profileReducer,
    shifts: shiftsReducer,
    receipts: receiptsReducer,
    recipes: recipesReducer,
    menusAndAds: menusAndAdsReducer,
    divisions: divisions,
    roles: roles,
  })(state, action);
}

const store = configureStore({
  reducer: rootReducer
});


export default store;

export type RootState = ReturnType<typeof rootReducer>;