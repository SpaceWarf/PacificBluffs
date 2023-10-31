import { useDispatch, useSelector } from 'react-redux';
import { getAllOrderItems, getOrderTotalPrice, ReceiptItem } from '../../../redux/selectors/order';
import { RootState } from '../../../redux/store';
import './ReceiptSidebar.scss';
import { getAlphabeticallyOrdered } from '../../../utils/array';
import { currencyFormat } from '../../../utils/currency';
import { clearOrder } from '../../../redux/reducers/order';
import Header from '../../Common/Header';
import StockModal from '../StockModal/StockModal';
import TipModal from './TipModal/TipModal';
import { Combo, ComboItem } from '../../../redux/reducers/menuItems';

function ReceiptSidebar() {
  const dispatch = useDispatch();
  const orderTotal = useSelector(getOrderTotalPrice);
  const allOrderItems = useSelector(
    (state: RootState) => getAlphabeticallyOrdered(getAllOrderItems(state, false), 'name')
  );
  const { clockedIn } = useSelector((state: RootState) => state.profile.info);
  const { items, combos, services } = useSelector((state: RootState) => state.menuItems);

  function handleClearOder() {
    dispatch(clearOrder());
  }

  function getComboItems(item: ReceiptItem): ComboItem[] {
    const foundCombo: Combo | undefined = combos.find((combo: Combo) => combo.id === item.id);
    return foundCombo?.items ?? [];
  }

  function getMenuItemName(id: string): string {
    switch (id) {
      case "cocktail":
        return "Any Cocktail";
      case "dessert":
        return "Any Dessert";
      default:
        return [...items, ...services].find(i => i.id === id)?.name || '';
    }
  }

  return (
    <div className="ui right sidebar vertical menu visible ReceiptSidebar">
      <Header text='Receipt' contrast />
      {allOrderItems.length > 0 ? (
        <div className='Content'>
          <div className='Items'>
            {allOrderItems.map((item: ReceiptItem, index: number) => (
              <div className='Item' key={item.id}>
                <div className='ItemLabel'>
                  <p className='contrast'>{item.name} x {item.quantity}</p>
                  <p className='contrast'>{currencyFormat(item.price)}</p>
                </div>
                {[...getComboItems(item)]
                  .sort((a, b) => getMenuItemName(a.id).localeCompare(getMenuItemName(b.id)))
                  .map(comboItem => (
                    <div className='Item Indented' key={comboItem.id}>
                      <div className='ItemLabel'>
                        <p className='contrast'>{getMenuItemName(comboItem.id)} x {item.quantity * comboItem.quantity}</p>
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>
          <div className='Total'>
            <p className='contrast'><b>Total</b></p>
            <p className='contrast'><b>{currencyFormat(orderTotal)}</b></p>
          </div>
          <div className='Actions'>
            <StockModal />
            <button
              className='ui button negative hover-animation Clear'
              onClick={handleClearOder}
            >
              <p className='label contrast'>Clear Order</p>
              <p className='IconContainer contrast'><i className='close icon'></i></p>
            </button>
            {clockedIn ? (
              <div className='ConfirmContainer'>
                <TipModal />
              </div>
            ) : (
              <div
                className='ConfirmContainer'
                data-tooltip="You must be clocked in to confirm an order."
                data-position="bottom center"
              >
                <button
                  className='ui button positive hover-animation Confirm'
                  disabled
                >
                  <p className='label contrast'>Confirm Order</p>
                  <p className='IconContainer contrast'><i className='check icon'></i></p>
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className='contrast'>
          There are no items in this order.
        </p>
      )}
    </div>
  );
}

export default ReceiptSidebar;