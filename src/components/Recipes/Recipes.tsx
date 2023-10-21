import { useDispatch, useSelector } from 'react-redux';
import './Recipes.scss';
import { RootState } from '../../redux/store';
import RecipeItemCard from './RecipeItem/RecipeItem';
import Header from '../Common/Header';
import { Quantity, setIngredientQuantity, setItemQuantity } from '../../redux/reducers/recipes';
import { ActionCreator, AnyAction } from '@reduxjs/toolkit';
import RecipeSidebar from './RecipeSidebar/RecipeSidebar';
import { getAlphabeticallyOrdered } from '../../utils/array';
import { MenuItem, MenuItemType } from '../../redux/reducers/menuItems';

function Recipes() {
  const dispatch = useDispatch();
  const menuItems = useSelector((state: RootState) => getAlphabeticallyOrdered(state.menuItems.items.filter(i => i.recipe.length), 'name'));
  const ingredients = useSelector((state: RootState) => state.ingredients.items);
  const complexIngredients = getAlphabeticallyOrdered(ingredients.filter(ingredient => ingredient.complex), 'name');
  const selectedIngredients = useSelector((state: RootState) => state.recipes.ingredients);
  const selectedMenuItems = useSelector((state: RootState) => state.recipes.items);

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
    <div className="Recipes">
      <Header text='Food Recipes' decorated />
      <div className='content'>
        {menuItems.filter((item: MenuItem) => item.type === MenuItemType.FOOD).map(item => (
          <RecipeItemCard
            key={item.id}
            item={item}
            value={getQuantity(item.id, selectedMenuItems)}
            onChange={e => onSetQuantity(item.id, e, setItemQuantity)}
          />
        ))}
      </div>
      <Header text='Drinks Recipes' decorated />
      <div className='content'>
        {menuItems.filter((item: MenuItem) => item.type === MenuItemType.DRINK).map(item => (
          <RecipeItemCard
            key={item.id}
            item={item}
            value={getQuantity(item.id, selectedMenuItems)}
            onChange={e => onSetQuantity(item.id, e, setItemQuantity)}
          />
        ))}
      </div>
      <Header text='Store Item Recipes' decorated />
      <div className='content'>
        {menuItems.filter((item: MenuItem) => item.type === MenuItemType.STORE).map(item => (
          <RecipeItemCard
            key={item.id}
            item={item}
            value={getQuantity(item.id, selectedMenuItems)}
            onChange={e => onSetQuantity(item.id, e, setItemQuantity)}
          />
        ))}
      </div>
      <Header text='Complex Ingredients' decorated />
      <div className='content'>
        {complexIngredients.map(item => (
          <RecipeItemCard
            key={item.id}
            item={item}
            value={getQuantity(item.id, selectedIngredients)}
            onChange={e => onSetQuantity(item.id, e, setIngredientQuantity)}
          />
        ))}
      </div>
      <RecipeSidebar />
    </div>
  );
}


export default Recipes;
