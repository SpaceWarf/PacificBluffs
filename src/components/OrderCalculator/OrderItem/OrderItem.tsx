import './OrderItem.scss';
import { useSelector } from 'react-redux';
import { Combo, ComboItem, MenuItem } from '../../../redux/reducers/menuItems';
import { RootState } from '../../../redux/store';
import { getAlphabeticallyOrdered } from '../../../utils/array';
import { currencyFormat } from '../../../utils/currency';
import { ChangeEvent } from "react";

interface OrderItemProps {
  item: MenuItem | Combo;
  value: number;
  onChange: (number: number) => void;
  omitDetails?: boolean;
}

function OrderItem({ item, value, onChange, omitDetails }: OrderItemProps) {
  const menuItems = useSelector( (state: RootState) => state.menuItems.items);

  function handleAdd() {
    onChange(value + 1);
  }

  function handleRemove() {
    onChange(value - 1);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onChange(parseInt(e.target.value));
  }

  function getItems(): ComboItem[] {
    const items = (item as Combo).items || [];
    return getAlphabeticallyOrdered(items, 'id');
  }

  function getItemName(id: string): string {
    return menuItems.find(i => i.id === id)?.name || '';
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      onChange(value === 0 ? 0 : value - 1);
    } else if (e.key === 'ArrowUp') {
      onChange(value + 1);
    }
  }

  return (
    <div className="OrderItem ui card">
      <div className="content">
        <div className="header">{item.name}</div>
        {'stock' in item ? (
          <div>{currencyFormat(item.price)} - {item.stock} in stock</div>
        ) : (
          <div>{currencyFormat(item.price)}</div>
        )}
      </div>
      {!omitDetails && getItems().length > 0 && <div className="content">
        <div className="ui bulleted list">
          {getItems().map((comboItem: ComboItem) => (
            <div
              key={`${comboItem.id}-${comboItem.id}`}
              className='item'
            >{getItemName(comboItem.id)} x {comboItem.quantity}</div>
          ))}
        </div>
      </div>}
      <div className='extra content'>
        <button className="ui button negative" disabled={value <= 0} onClick={handleRemove}>
          <i className="minus icon"></i>
        </button>
        <div className='ui input'>
          <input
            name='quantity'
            type="text"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            autoComplete='off'
          />
        </div> 
        <button className="ui button positive" onClick={handleAdd}>
          <i className="add icon"></i>
        </button>
      </div>
    </div>
  );
}


export default OrderItem;
