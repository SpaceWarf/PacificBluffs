import './OrderCalculator.scss';
import { Quantity, setComboQuantity, setItemQuantity } from '../../redux/reducers/order';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import OrderItem from './OrderItem/OrderItem';
import { Combo, MenuItem } from '../../redux/reducers/menuItems';
import { getAlphabeticallyOrdered } from '../../utils/array';
import { ActionCreator, AnyAction } from '@reduxjs/toolkit';
import ReceiptSidebar from './ReceiptSidebar/ReceiptSidebar';
import Header from '../Common/Header';
import { getDrinksItems, getFoodItems } from '../../redux/selectors/menuItems';

function OrderCalculator() {
  const items = useSelector(
    (state: RootState) => state.order.items
  );
  const foodMenuItems = useSelector(
    (state: RootState) => getAlphabeticallyOrdered(getFoodItems(state), 'name')
  );
  const drinksMenuItems = useSelector(
    (state: RootState) => getAlphabeticallyOrdered(getDrinksItems(state), 'name')
  );
  const combos = useSelector(
    (state: RootState) => state.order.combos
  );
  const menuCombos = useSelector(
    (state: RootState) => getAlphabeticallyOrdered(state.menuItems.combos, 'name')
  );
  const dispatch = useDispatch();

  function getQuantity(id: string, objects: Quantity[]) {
    const itemIndex = objects.findIndex(i => i.id === id);
    return itemIndex === -1 ? 0 : objects[itemIndex].quantity;
  }

  function onSetQuantity(id: string, quantity: number, action: ActionCreator<AnyAction>) {
    if (isNaN(quantity)) {
      dispatch(action({ id, quantity: 0 }));
    }

    if (quantity >= 0) {
      dispatch(action({ id, quantity }));
    }
  }

  return (
    <div className="OrderCalculator">
      <div className='Section'>
        <Header text="Combos" decorated />
        <div className='Combos'>
          {menuCombos.map((combo: Combo) => (
            <OrderItem
              key={combo.id}
              item={combo}
              value={getQuantity(combo.id, combos)}
              onChange={(e) => onSetQuantity(combo.id, e, setComboQuantity)}
            />
          ))}
        </div>
      </div>
      <div className='Section'>
        <Header text='Food' decorated />
        <div className='MenuItems'>
          {foodMenuItems.map((item: MenuItem) => (
            <OrderItem
              key={item.id}
              item={item}
              value={getQuantity(item.id, items)}
              onChange={(e) => onSetQuantity(item.id, e, setItemQuantity)}
            />
          ))}
        </div>
      </div>
      <div className='Section'>
        <Header text='Drinks' decorated />
        <div className='MenuItems'>
          {drinksMenuItems.map((item: MenuItem) => (
            <OrderItem
              key={item.id}
              item={item}
              value={getQuantity(item.id, items)}
              onChange={(e) => onSetQuantity(item.id, e, setItemQuantity)}
            />
          ))}
        </div>
      </div>
      <ReceiptSidebar />
    </div>
  );
}


export default OrderCalculator;
