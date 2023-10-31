import './RecipeItem.scss';
import { useSelector } from 'react-redux';
import { Ingredient, MenuItem, RecipeItem } from '../../../redux/reducers/menuItems';
import { RootState } from '../../../redux/store';
import { ChangeEvent } from "react";

interface RecipeItemProps {
  item: MenuItem | Ingredient;
  value: number;
  onChange: (number: number) => void;
}

function RecipeItemCard({ item, value, onChange }: RecipeItemProps) {
  const ingredients = useSelector((state: RootState) => state.ingredients.items);

  function handleAdd() {
    onChange(value + 1);
  }

  function handleRemove() {
    onChange(value - 1);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onChange(parseInt(e.target.value));
  }

  function getIngredientName(id: string): string {
    return ingredients.find(i => i.id === id)?.name || '';
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      onChange(value === 0 ? 0 : value - 1);
    } else if (e.key === 'ArrowUp') {
      onChange(value + 1);
    }
  }

  return (
    <div className="RecipeItemCard ui card">
      <div className="content">
        <div className="header">{item.name}</div>
      </div>
      {item.recipe && (
        <div className="content">
          {item.recipe.length > 0 ? (
            <div className="ui bulleted list">
              {[...item.recipe]
                .sort((a, b) => getIngredientName(a.id).localeCompare(getIngredientName(b.id)))
                .map((ingredient: RecipeItem) => (
                  <div
                    key={`${item.id}-${ingredient.id}`}
                    className='item'
                  >{getIngredientName(ingredient.id)} x {ingredient.quantity}</div>
                ))}
            </div>
          ) : (
            <p>No recipe available for this item.</p>
          )}
        </div>
      )}
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


export default RecipeItemCard;
