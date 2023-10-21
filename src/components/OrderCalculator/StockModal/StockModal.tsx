import './StockModal.scss';
import { useState } from "react";
import { Modal } from "semantic-ui-react";
import Header from "../../Common/Header";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { getAlphabeticallyOrdered } from "../../../utils/array";
import { ReceiptItem, getAllOrderItems } from "../../../redux/selectors/order";
import { Ingredient } from '../../../redux/reducers/menuItems';
import { useNavigate } from 'react-router-dom';
import { setIngredientQuantity, setItemQuantity } from '../../../redux/reducers/recipes';

interface StockError {
  type: ErrorType;
  item: ReceiptItem;
  stock: number;
  ingredientErrors?: IngredientError[];
}

interface IngredientError {
  ingredient: Ingredient;
  quantity: number;
  stock: number;
}

enum ErrorType {
  MISSING_INGREDIENTS = 'MISSING_INGREDIENTS',
  MISSING_MENU_ITEMS = 'MISSING_MENU_ITEMS',
  MISSING_MENU_ITEMS_NO_RECIPE = 'MISSING_MENU_ITEMS_NO_RECIPE'
}

function StockModal() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const allOrderItems: ReceiptItem[] = useSelector(
    (state: RootState) => getAlphabeticallyOrdered(getAllOrderItems(state), 'name')
  );
  const ingredients = useSelector((state: RootState) => state.ingredients.items);
  const menuItems = useSelector((state: RootState) => state.menuItems.items);
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<StockError[]>([]);

  function handleOpen() {
    setOpen(true);
    setErrors(checkStock());
  }

  function checkStock(): StockError[] {
    const errors: StockError[] = [];
    allOrderItems.forEach(receiptItem => {
      const menuItem = menuItems.find(menuItem => menuItem.id === receiptItem.id);
      const stock = menuItem?.stock || 0;

      if (menuItem && stock < receiptItem.quantity) {
        const missingStock = receiptItem.quantity - stock;
        const ingredientErrors: IngredientError[] = [];
        menuItem.recipe.forEach(recipeItem => {
          const ingredient = ingredients.find(ingredient => ingredient.id === recipeItem.id);
          const stock = ingredient?.stock || 0;

          if (ingredient && stock < missingStock) {
            ingredientErrors.push({
              ingredient,
              quantity: missingStock,
              stock
            });
          }
        });

        if (ingredientErrors.length > 0) {
          errors.push({ type: ErrorType.MISSING_INGREDIENTS, item: receiptItem, stock, ingredientErrors });
        } else if (menuItem.recipe.length === 0) {
          errors.push({ type: ErrorType.MISSING_MENU_ITEMS_NO_RECIPE, item: receiptItem, stock });
        } else {
          errors.push({ type: ErrorType.MISSING_MENU_ITEMS, item: receiptItem, stock });
        }
      }
    });
    return errors;
  }

  function getOrderedErrors(): StockError[] {
    const order = [
      ErrorType.MISSING_INGREDIENTS,
      ErrorType.MISSING_MENU_ITEMS_NO_RECIPE,
      ErrorType.MISSING_MENU_ITEMS,
    ];
    return errors.sort((a, b) => {
      return order.indexOf(a.type) - order.indexOf(b.type);
    })
  }

  function handleGoToRecipes() {
    errors.forEach(error => {
      if (error.type === ErrorType.MISSING_MENU_ITEMS) {
        dispatch(setItemQuantity({
          id: error.item.id,
          quantity: error.item.quantity - error.stock
        }));
      } else if (error.type === ErrorType.MISSING_INGREDIENTS) {
        error.ingredientErrors?.forEach(ingredientError => {
          dispatch(setIngredientQuantity({
            id: ingredientError.ingredient.id,
            quantity: ingredientError.quantity - ingredientError.stock
          }));
        });
      }
    });
    setOpen(false);
    navigate('/recipes');
  }

  return (
    <Modal
      className="StockModal Modal"
      onClose={() => setOpen(false)}
      onOpen={handleOpen}
      open={open}
      trigger={
        <button
          className='ui button positive hover-animation CheckStock'
        >
          <p className='label contrast'>Check Stock</p>
          <p className='IconContainer contrast'><i className='box icon'></i></p>
        </button>
      }
    >
      <Modal.Header><Header text='Stock Check' decorated /></Modal.Header>
      <Modal.Content>
        <Modal.Description>
          {getOrderedErrors().map(error => {
            if (error.type === ErrorType.MISSING_MENU_ITEMS) return (
              <div key={error.item.id} className='ErrorMessage warning'>
                <i className="exclamation triangle icon"></i>
                <span>
                  {error.item.name} - {error.item.quantity} ordered, {error.stock} in stock - Enough ingredients for remaining {error.item.quantity - error.stock} items
                </span>
              </div>
            )
            if (error.type === ErrorType.MISSING_INGREDIENTS) return (
              <div key={error.item.id} className='ErrorMessage error'>
                <div className='Label'>
                  <i className="exclamation triangle icon"></i>
                  <span>
                    {error.item.name} - {error.item.quantity} ordered, {error.stock} in stock - Missing ingredients for remaining {error.item.quantity - error.stock} items
                  </span>
                </div>
                <div className='MissingIngredients'>
                  <div className='ui bulleted list'>
                    {error.ingredientErrors?.map(ingredientError => (
                      <div key={`${error.item.id}-${ingredientError.ingredient.id}`} className='item'>
                        {ingredientError.ingredient.name} - {ingredientError.quantity} required, {ingredientError.stock} in stock
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
            if (error.type === ErrorType.MISSING_MENU_ITEMS_NO_RECIPE) return (
              <div key={error.item.id} className='ErrorMessage error'>
                <div className='Label'>
                  <i className="exclamation triangle icon"></i>
                  <span>
                    {error.item.name} - {error.item.quantity} ordered, {error.stock} in stock
                  </span>
                </div>
              </div>
            )
            return null;
          })}
          {errors.length === 0 && (
            <div className='ErrorMessage success'>
              <i className="check icon"></i>
              <span>All items are in stock; the order is ready to be served!</span>
            </div>
          )}
        </Modal.Description>
        <Modal.Actions>
          <button
            className='ui button negative hover-animation'
            onClick={() => setOpen(false)}
          >
            <p className='label contrast'>Close</p>
            <p className='IconContainer contrast'><i className='close icon'></i></p>
          </button>
          <button
            className='ui button positive hover-animation'
            onClick={handleGoToRecipes}
          >
            <p className='label contrast'>Go To Recipes</p>
            <p className='IconContainer contrast'><i className='utensils icon'></i></p>
          </button>
        </Modal.Actions>
      </Modal.Content>
    </Modal>
  );
}

export default StockModal;