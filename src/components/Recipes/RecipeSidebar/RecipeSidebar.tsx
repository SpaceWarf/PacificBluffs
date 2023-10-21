import './RecipeSidebar.scss';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../Common/Header';
import { clearRecipes } from '../../../redux/reducers/recipes';
import { RecipeItem, getAllRecipeIngredients } from '../../../redux/selectors/recipes';
import { getAlphabeticallyOrdered } from '../../../utils/array';
import { useState } from 'react';

function RecipeSidebar() {
  const dispatch = useDispatch();
  const ingredients = useSelector(getAllRecipeIngredients);
  const [expandedRecipes, setExpandedRecipes] = useState<string[]>([]);

  function handleClearOder() {
    dispatch(clearRecipes());
  }

  function hasRecipe(ingredient: RecipeItem): boolean {
    return !!ingredient.recipe && ingredient.recipe.length > 0;
  }

  function showRecipe(ingredient: RecipeItem): boolean {
    return expandedRecipes.includes(ingredient.id);
  }

  function handleExpand(ingredient: RecipeItem) {
    if (hasRecipe(ingredient)) {
      if (showRecipe(ingredient)) {
        setExpandedRecipes(expandedRecipes.filter(id => id !== ingredient.id));
      } else {
        setExpandedRecipes([...expandedRecipes, ingredient.id]);
      }
    }
  }

  return (
    <div className="ui right sidebar vertical menu visible RecipeSidebar">
      <Header text='Ingredients List' contrast />
      {ingredients.length > 0 ? (
        <div className='Content'>
          <div className='Items'>
            {getAlphabeticallyOrdered(ingredients, 'name').map(ingredient => (
              <div className='Item' key={ingredient.id}>
                <div className={`ItemLabel ${hasRecipe(ingredient) ? 'Dropdown' : ''}`} onClick={() => handleExpand(ingredient)}>
                  <p className='contrast'>
                    {hasRecipe(ingredient) && (
                      <i className={`angle right icon ${showRecipe(ingredient) ? 'Open' : ''}`}></i>
                    )}
                    <b>{ingredient.name}</b>
                  </p>
                  <p className='contrast'><b>x {ingredient.quantity}</b></p>
                </div>
                {showRecipe(ingredient) && getAlphabeticallyOrdered(ingredient.recipe, 'name').map(recipeIngredient => (
                  <div className='ItemLabel RecipeItemLabel' key={`${ingredient.id}-${recipeIngredient.id}`}>
                    <p className='contrast'>{recipeIngredient.name}</p>
                    <p className='contrast'>x {recipeIngredient.quantity}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className='Actions'>
            <button
              className='ui button negative hover-animation Clear'
              onClick={handleClearOder}
            >
              <p className='label contrast'>Clear Recipe</p>
              <p className='IconContainer contrast'><i className='close icon'></i></p>
            </button>
          </div>
        </div>
      ) : (
        <p className='contrast'>
          There are no selected recipes.
        </p>
      )}
    </div>
  );
}

export default RecipeSidebar;