import './OrderCalculator.scss';
import { Quantity, setComboQuantity, setItemQuantity, setServiceQuantity } from '../../redux/reducers/order';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import OrderItem from './OrderItem/OrderItem';
import { Combo, MenuItem, Service } from '../../redux/reducers/menuItems';
import { getAlphabeticallyOrdered } from '../../utils/array';
import { ActionCreator, AnyAction } from '@reduxjs/toolkit';
import ReceiptSidebar from './ReceiptSidebar/ReceiptSidebar';
import Header from '../Common/Header';
import { getDrinksItems, getFoodItems, getStoreItems } from '../../redux/selectors/menuItems';

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
  const storeMenuItems = useSelector(
    (state: RootState) => getAlphabeticallyOrdered(getStoreItems(state), 'name')
  );
  const menuCombos = useSelector(
    (state: RootState) => getAlphabeticallyOrdered(state.menuItems.combos, 'name')
  );
  const menuServices = useSelector(
    (state: RootState) => getAlphabeticallyOrdered(state.menuItems.services, 'name')
  );
  const combos = useSelector(
    (state: RootState) => state.order.combos
  );
  const services = useSelector(
    (state: RootState) => state.order.services
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
      <div className='Section'>
        <Header text='Store Items' decorated />
        <div className='MenuItems'>
          {storeMenuItems.map((item: MenuItem) => (
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
        <Header text="Services" decorated />
        <div className='Services'>
          {menuServices.map((service: Service) => (
            <OrderItem
              key={service.id}
              item={service}
              value={getQuantity(service.id, services)}
              onChange={(e) => onSetQuantity(service.id, e, setServiceQuantity)}
              omitDetails
            />
          ))}
        </div>
      </div>
      <div className='Section'>
        <Header text="Packages" decorated />
        <div className='Combos'>
          {menuCombos.map((combo: Combo) => (
            <div>
              <OrderItem
                key={combo.id}
                item={combo}
                value={getQuantity(combo.id, combos)}
                onChange={(e) => onSetQuantity(combo.id, e, setComboQuantity)}
              />
            </div>
          ))}
        </div>
      </div>
      <ReceiptSidebar />
    </div>
  );
}


export default OrderCalculator;
