import { Quantity } from "../reducers/order";
import { RootState } from "../store";
import { getMenuItemById } from "./menuItems";

export interface ReceiptItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export function getOrderTotalPrice(state: RootState): number {
  const combosPrice = state.order.combos.reduce((total: number, item: Quantity) => {
    const menuCombo = state.menuItems.combos.find(menuCombo => menuCombo.id === item.id);
    return total + (item.quantity * (menuCombo?.price || 0));
  }, 0);
  const itemsPrice = state.order.items.reduce((total: number, item: Quantity) => {
    const menuItem = state.menuItems.items.find(menuItem => menuItem.id === item.id);
    return total + (item.quantity * (menuItem?.price || 0));
  }, 0);
  return combosPrice + itemsPrice;
}

export function getAllOrderItems(state: RootState, flat = true): ReceiptItem[] {
  const receiptItems: ReceiptItem[] = [];
  const orderItems = state.order.items;

  orderItems.forEach((orderItem: Quantity) => {
    if (orderItem.quantity > 0) {
      const menuItem = getMenuItemById(state, orderItem.id);

      if (menuItem) {
        receiptItems.push({
          id: orderItem.id,
          name: menuItem.name,
          quantity: orderItem.quantity,
          price: menuItem.price * orderItem.quantity
        });
      }
    }
  });

  const orderCombos = state.order.combos;

  orderCombos.forEach((orderCombo: Quantity) => {
    if (orderCombo.quantity > 0) {
      const menuCombo = state.menuItems.combos.find(menuCombo => menuCombo.id === orderCombo.id);

      if (menuCombo) {
        if (flat) {
          menuCombo.items.forEach((comboItem: Quantity) => {
            if (comboItem.quantity > 0) {
              const menuItem = getMenuItemById(state, comboItem.id);

              if (menuItem) {
                const receiptIndex = receiptItems.findIndex(receiptItem => receiptItem.id === comboItem.id);

                if (receiptIndex >= 0) {
                  receiptItems[receiptIndex].quantity += comboItem.quantity * orderCombo.quantity;
                  receiptItems[receiptIndex].price += menuItem.price * comboItem.quantity * orderCombo.quantity;
                } else {
                  receiptItems.push({
                    id: comboItem.id,
                    name: menuItem.name,
                    quantity: comboItem.quantity * orderCombo.quantity,
                    price: menuItem.price * comboItem.quantity * orderCombo.quantity
                  });
                }
              }
            }
          });
        } else {
          receiptItems.push({
            id: menuCombo.id,
            name: menuCombo.name,
            quantity: orderCombo.quantity,
            price: menuCombo.price * orderCombo.quantity
          });
        }
      }
    }
  });

  return receiptItems;
}