import './InventoryItem.scss';
import { ChangeEvent, MouseEvent, createRef, useState } from 'react';
import { Ingredient, MenuItem } from '../../../redux/reducers/menuItems';

interface InventoryItemProps {
  item: MenuItem | Ingredient;
  onChange: (number: number) => void;
}

function InventoryItem({ item, onChange }: InventoryItemProps) {
  const [editedValue, setEditedValue] = useState(item.stock);
  const cardRef = createRef<HTMLDivElement>();
  const viewRef = createRef<HTMLDivElement>();
  const editRef = createRef<HTMLDivElement>();
  const inputRef = createRef<HTMLInputElement>();
  
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const value = parseInt(e.target.value);

    if (isNaN(value)) {
      setEditedValue(0);
    }

    if (value >= 0) {
      setEditedValue(value);
    }
  }

  function revealEdit() {
    cardRef.current?.classList.remove('link');
    viewRef.current?.classList.remove('visible');
    editRef.current?.classList.add('visible');
    inputRef.current?.select();
  }

  function hideEdit(e?: MouseEvent) {
    if (e) {
      e.stopPropagation();
    }

    cardRef.current?.classList.add('link');
    editRef.current?.classList.remove('visible');
    viewRef.current?.classList.add('visible');
  }
  
  function handleSave(e?: MouseEvent) {
    hideEdit(e);
    onChange(editedValue);
  }

  function handleCancel(e?: MouseEvent) {
    setEditedValue(item.stock);
    hideEdit(e);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'ArrowDown') {
      setEditedValue(editedValue === 0 ? 0 : editedValue - 1);
    } else if (e.key === 'ArrowUp') {
      setEditedValue(editedValue + 1);
    }
  }

  function getStockLabel() {
    if (item.stock > 100) {
      return (
        <div className='InStock'>
          <i className='check circle icon'></i>
          <p>In Stock - {item.stock}</p>
        </div>
      );
    } else if (item.stock > 0) {
      return (
        <div className='LowStock'>
          <i className='exclamation triangle icon'></i>
          <p>Low Stock - {item.stock}</p>
        </div>
      );
    } else {
      return (
        <div className='OutOfStock'>
          <i className='exclamation triangle icon'></i>
          <p>Out Of Stock</p>
        </div>
      );
    }
  }

  return (
    <div className='InventoryItem ui card link' ref={cardRef} onClick={revealEdit}>
      <div className="content">
        <div className="header">{item.name}</div>
      </div>
      <div className='extra content'>
        <div className='left visible ToggleContent' ref={viewRef}>
            {getStockLabel()}
        </div>
        <div className='right ToggleContent' ref={editRef}>
          <div className='Form'>
            <div className='ui input'>
              <input
                ref={inputRef}
                name='quantity'
                type="text"
                value={editedValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                tabIndex={-1}
                autoComplete='off'
              />
            </div> 
            <button
              className='ui button negative'
              onClick={handleCancel}
              tabIndex={-1}
            ><i className='close icon'></i></button>
            <button
              className='ui button positive'
              onClick={handleSave}
              tabIndex={-1}
            ><i className='check icon'></i></button>
          </div>
        </div>
      </div>
    </div>
  );
}


export default InventoryItem;
