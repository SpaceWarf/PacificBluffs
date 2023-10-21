import './ReceiptEditModal.scss';
import { useEffect, useState } from "react";
import { Dropdown, Form, Modal } from "semantic-ui-react";
import Header from "../../Common/Header";
import { Receipt } from '../../../redux/reducers/receipts';
import OrderItem from '../../OrderCalculator/OrderItem/OrderItem';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { updateReceipt as updateReceiptInDb } from '../../../utils/firestore';
import { Quantity } from '../../../redux/reducers/order';
import { MenuItem } from '../../../redux/reducers/menuItems';
import { Combo } from '../../../redux/reducers/menuItems';
import Input from '../../Common/Input';

interface ClockOutModalProps {
  receipt: Receipt;
}

interface Values {
  [key: string]: number;
}

function ReceiptEditModal({ receipt }: ClockOutModalProps) {
  const [open, setOpen] = useState(false);
  const menuCombos = useSelector((state: RootState) => state.menuItems.combos);
  const menuItems = useSelector((state: RootState) => state.menuItems.items);
  const [comboValues, setComboValues] = useState({} as Values);
  const [itemValues, setItemValues] = useState({} as Values);
  const [search, setSearch] = useState('');
  const [tip, setTip] = useState(receipt.tip);
  const addOptions = [...menuCombos, ...menuItems];

  function handleConfirm() {
    const updatedItems = [...receipt.items];
    const updatedCombos = [...receipt.combos];

    Object.entries(itemValues).forEach(([id, quantity]) => {
      const itemIndex = updatedItems.findIndex(item => item.id === id);

      if (itemIndex === -1 && quantity > 0) {
        updatedItems.push({ id, quantity });
      } else if (itemIndex !== -1 && quantity === 0) {
        updatedItems.splice(itemIndex, 1);
      } else {
        updatedItems[itemIndex] = { id, quantity };
      }
    });

    Object.entries(comboValues).forEach(([id, quantity]) => {
      const comboIndex = updatedCombos.findIndex(combo => combo.id === id);

      if (comboIndex === -1 && quantity > 0) {
        updatedCombos.push({ id, quantity });
      } else if (comboIndex !== -1 && quantity === 0) {
        updatedCombos.splice(comboIndex, 1);
      } else {
        updatedCombos[comboIndex] = { id, quantity };
      }
    });

    const updatedReceipt: Receipt = {
      ...receipt,
      items: updatedItems,
      combos: updatedCombos,
      total: getTotalPrice(updatedItems, updatedCombos),
      tip,
    };
    updateReceiptInDb(updatedReceipt);
    handleClose();
  }

  function getTotalPrice(items: Quantity[], combos: Quantity[]): number {
    return [...items, ...combos].reduce((total: number, item: Quantity) => {
      const menuCombo = menuCombos.find(menuCombo => menuCombo.id === item.id);
      return total + (item.quantity * (menuCombo?.price || 0));
    }, 0);
  }

  function getComboById(id: string) {
    return menuCombos.find(combo => combo.id === id);
  }

  function getItemById(id: string) {
    return menuItems.find(item => item.id === id);
  }

  function handleComboChange(id: string, value: number) {
    setComboValues({ ...comboValues, [id]: value });
  }

  function handleItemChange(id: string, value: number) {
    setItemValues({ ...itemValues, [id]: value });
  }

  function handleAddItem(item: MenuItem | Combo) {
    if ('recipe' in item) {
      setItemValues({ ...itemValues, [item.id]: 1 });
    }

    if ('items' in item) {
      setComboValues({ ...comboValues, [item.id]: 1 });
    }
  }

  function getFilteredOptions() {
    return addOptions.filter(option => (
      comboValues[option.id] === undefined &&
      itemValues[option.id] === undefined &&
      option.name.toLowerCase().includes(search.toLowerCase())
    ));
  }

  function handleClose() {
    const initialComboValues: Values = {};
    const initialItemValues: Values = {};

    receipt.combos.forEach(combo => {
      initialComboValues[combo.id] = combo.quantity;
    });
    receipt.items.forEach(item => {
      initialItemValues[item.id] = item.quantity;
    });

    setComboValues(initialComboValues);
    setItemValues(initialItemValues);
    setOpen(false);
    setSearch('');
  }

  function handleTipChange(value: number) {
    if (isNaN(value)) {
      setTip(0);
    }

    if (value >= 0) {
      setTip(value);
    }
  }

  useEffect(() => {
    const initialComboValues: Values = {};
    const initialItemValues: Values = {};

    receipt.combos.forEach(combo => {
      initialComboValues[combo.id] = combo.quantity;
    });
    receipt.items.forEach(item => {
      initialItemValues[item.id] = item.quantity;
    });

    setComboValues(initialComboValues);
    setItemValues(initialItemValues);
  }, [receipt.combos, receipt.items]);

  return (
    <div onClick={e => e.stopPropagation()}>
      <Modal
        className="Modal ReceiptEditModal"
        onClose={handleClose}
        onOpen={() => setOpen(true)}
        open={open}
        size='large'
        trigger={
          <button
            className='EditReceiptModalTrigger ui button icon hover-animation'
            onClick={e => e.stopPropagation()}
          >
            <i className='pencil alternate icon'></i>
          </button>
        }
      >
        <Modal.Header><Header text='Edit Receipt' decorated /></Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Form>
              <div className='OrderItems'>
                {Object.entries(comboValues).map(([key, value]) => {
                  const comboItem = getComboById(key);

                  if (comboItem) return (
                    <OrderItem
                      key={key}
                      item={comboItem}
                      value={value}
                      onChange={e => handleComboChange(key, e)}
                      omitDetails
                    />
                  );
                  return null;
                })}
                {Object.entries(itemValues).map(([key, value]) => {
                  const menuItem = getItemById(key);

                  if (menuItem) return (
                    <OrderItem
                      key={key}
                      item={menuItem}
                      value={value}
                      onChange={e => handleItemChange(key, e)}
                      omitDetails
                    />
                  );
                  return null;
                })}
                <Dropdown
                  trigger={
                    <div className='ui card link AddItemButton'>
                      <div className='content'>
                        <i className='add icon'></i>
                      </div>
                    </div>
                  }
                  icon={null}
                >
                  <Dropdown.Menu>
                    <div className="ui left icon input">
                      <i className="search icon"></i>
                      <input
                        type="text"
                        placeholder="Search..."
                        onClick={e => e.stopPropagation()}
                        onChange={e => setSearch(e.target.value)}
                        autoFocus={true}
                      />
                    </div>
                    <Dropdown.Menu scrolling>
                      {getFilteredOptions().map(option => (
                        <Dropdown.Item
                          key={option.id}
                          text={option.name}
                          value={option.id}
                          onClick={() => handleAddItem(option)}
                        />
                      ))}
                    </Dropdown.Menu>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <Input
                type='text'
                name="tip"
                placeholder='Tip'
                icon="dollar sign"
                value={tip.toString()}
                onChange={e => handleTipChange(parseFloat(e))}
                onSubmit={handleConfirm}
              />
            </Form>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <button
            className='ui button negative hover-animation'
            onClick={handleClose}
          >
            <p className='label contrast'>Cancel</p>
            <p className='IconContainer contrast'><i className='close icon'></i></p>
          </button>
          <button
            className='ui button positive hover-animation'
            onClick={handleConfirm}
          >
            <p className='label contrast'>Confirm</p>
            <p className='IconContainer contrast'><i className='check icon'></i></p>
          </button>
        </Modal.Actions>
      </Modal>
    </div>
  );
}

export default ReceiptEditModal;