import './Inventory.scss';
import { useSelector } from 'react-redux';
import Header from '../Common/Header';
import { RootState } from '../../redux/store';
import InventoryItem from './InventoryItem/InventoryItem';
import { getAlphabeticallyOrdered } from '../../utils/array';
import { updateIngredientStock, updateMenuItemStock } from '../../utils/firestore';
import { MenuItem, MenuItemType } from '../../redux/reducers/menuItems';

function Inventory() {
  const menuItems = useSelector((state: RootState) => getAlphabeticallyOrdered(state.menuItems.items, 'name'));
  const ingredients = useSelector((state: RootState) => getAlphabeticallyOrdered(state.ingredients.items, 'name'));

  function handleUpdateMenuItem(id: string, stock: number) {
    updateMenuItemStock(id, stock);
  }

  function handleUpdateIngredient(id: string, stock: number) {
    updateIngredientStock(id, stock);
  }

  return (
    <div className="Inventory">
      <div className='Section'>
        <Header text='Food Stock' decorated />
        <div className='MenuItems'>
          {menuItems.filter((item: MenuItem) => item.type === MenuItemType.FOOD).map(item => (
            <InventoryItem
              key={item.id}
              item={item}
              onChange={e => handleUpdateMenuItem(item.id, e)}
            />
          ))}
        </div>
      </div>
      <div className='Section'>
        <Header text='Drinks Stock' decorated />
        <div className='MenuItems'>
          {menuItems.filter((item: MenuItem) => item.type === MenuItemType.DRINK).map(item => (
            <InventoryItem
              key={item.id}
              item={item}
              onChange={e => handleUpdateMenuItem(item.id, e)}
            />
          ))}
        </div>
      </div>
      <div className='Section'>
        <Header text='Store Items Stock' decorated />
        <div className='MenuItems'>
          {menuItems.filter((item: MenuItem) => item.type === MenuItemType.STORE).map(item => (
            <InventoryItem
              key={item.id}
              item={item}
              onChange={e => handleUpdateMenuItem(item.id, e)}
            />
          ))}
        </div>
      </div>
      <div className='Section'>
        <Header text='Ingredients Stock' decorated />
        <div className='Ingredients'>
          {ingredients.map(item => (
            <InventoryItem
              key={item.id}
              item={item}
              onChange={e => handleUpdateIngredient(item.id, e)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}


export default Inventory;
