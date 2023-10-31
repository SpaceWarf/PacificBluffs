import { MenuItem, MenuItemType, Service } from "../reducers/menuItems";
import { RootState } from "../store";

export function getMenuItemById(state: RootState, id: string): MenuItem | undefined {
  return state.menuItems.items.find(menuItem => menuItem.id === id);
}

export function getFoodItems(state: RootState): MenuItem[] {
  return state.menuItems.items.filter(menuItem => menuItem.type === MenuItemType.FOOD);
}

export function getDrinksItems(state: RootState): MenuItem[] {
  return state.menuItems.items.filter(menuItem => menuItem.type === MenuItemType.DRINK);
}

export function getStoreItems(state: RootState): MenuItem[] {
  return state.menuItems.items.filter(menuItem => menuItem.type === MenuItemType.STORE);
}

export function getServiceById(state: RootState, id: string): Service | undefined {
  return state.menuItems.services.find(menuService => menuService.id === id);
}