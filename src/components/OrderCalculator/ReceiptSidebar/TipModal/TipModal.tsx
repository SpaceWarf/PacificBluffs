import './TipModal.scss';
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Modal } from "semantic-ui-react";
import { useAuth } from "../../../../contexts/AuthContext";
import { getCurrentShift } from "../../../../redux/selectors/shifts";
import { createReceipt } from "../../../../utils/firestore";
import { Receipt } from "../../../../redux/reducers/receipts";
import { RootState } from "../../../../redux/store";
import { getOrderTotalPrice } from "../../../../redux/selectors/order";
import { clearOrder } from "../../../../redux/reducers/order";
import Header from "../../../Common/Header";
import Input from "../../../Common/Input";
import { currencyFormat } from '../../../../utils/currency';

function TipModal() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const currentShift = useSelector(getCurrentShift);
  const order = useSelector((state: RootState) => state.order);
  const orderTotal = useSelector(getOrderTotalPrice);
  const [open, setOpen] = useState(false);
  const [tipOnly, setTipOnly] = useState(false);
  const [tip, setTip] = useState(orderTotal);
  const [tipError, setTipError] = useState(false);

  async function handleConfirm() {
    if (tipOnly || tip >= orderTotal) {
      setTipError(false);
      const tipAmount = tipOnly ? tip : tip - orderTotal;
      
      if (user && currentShift?.id) {
        const receipt: Receipt = {
          employee: user.uid,
          shift: currentShift.id,
          items: order.items,
          combos: order.combos,
          total: orderTotal,
          date: new Date().toISOString(),
          tip: tipAmount,
        };
        await createReceipt(receipt);
        dispatch(clearOrder());
        setOpen(false);
      }
    } else {
      setTipError(true);
    }
  }

  function handleTipTypeChange() {
    if (tipOnly) {
      setTip(orderTotal);
    } else {
      setTip(0);
    }
    setTipOnly(!tipOnly);
  }

  function handleTipChange(value: number) {
    if (isNaN(value)) {
      setTip(0);
    }

    if (value >= 0) {
      setTip(value);
    }
  }

  function validateTip() {
    if (!tipOnly && tip < orderTotal) {
      setTipError(true);
    } else {
      setTipError(false);
    }
  }

  function handleOpen() {
    setOpen(true);
    setTip(orderTotal);
    setTipOnly(false);
    setTipError(false);
  }

  return (
    <Modal
      className="TipModal Modal"
      onClose={() => setOpen(false)}
      onOpen={handleOpen}
      open={open}
      size="small"
      trigger={
        <button
          className='ui button positive hover-animation Confirm'
        >
          <p className='label contrast'>Confirm Order</p>
          <p className='IconContainer contrast'><i className='check icon'></i></p>
        </button>
      }
    >
      <Modal.Header><Header text='Tip' decorated /></Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <p>To add tip to your order you can enter the new total order price or use the "Tip Only" option and enter only the additional tip. When entering a new total order price, the new price must be greater than the original price of <b>{currencyFormat(orderTotal)}</b></p>
          <Form>
            <div className="ui slider checkbox" onChange={handleTipTypeChange}>
              <input type="checkbox" name="tipFormat" checked={tipOnly} />
              <label>Tip Only</label>
            </div>
            <Input
              type='text'
              name="tip"
              placeholder={tipOnly ? 'Tip' : 'Order Total'}
              icon="dollar sign"
              value={tip.toString()}
              onChange={e => handleTipChange(parseFloat(e))}
              onSubmit={handleConfirm}
              error={tipError}
              onBlur={validateTip}
            />
          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <button
          className='ui button negative hover-animation'
          onClick={() => setOpen(false)}
        >
          <p className='label contrast'>Cancel</p>
          <p className='IconContainer contrast'><i className='close icon'></i></p>
        </button>
        <button
          className='ui button positive hover-animation'
          onClick={handleConfirm}
          disabled={tipError}
        >
          <p className='label contrast'>Confirm</p>
          <p className='IconContainer contrast'><i className='check icon'></i></p>
        </button>
      </Modal.Actions>
    </Modal>
  )
}

export default TipModal;