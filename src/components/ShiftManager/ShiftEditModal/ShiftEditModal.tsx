import { SyntheticEvent, useState } from "react";
import { Form, Modal, Rating, TextArea } from "semantic-ui-react";
import { Shift } from "../../../redux/reducers/shifts";
import Header from "../../Common/Header";
import { updateShift as updateShiftInDB } from '../../../utils/firestore';

interface ShiftEditModalProps {
  shift: Shift;
}

function ShiftEditModal({ shift }: ShiftEditModalProps) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(shift.rating);
  const [comments, setComments] = useState(shift.comments);

  function handleClose() {
    setRating(shift.rating);
    setComments(shift.comments);
    setOpen(false);
  }

  function handleConfirm() {
    const updatedShift = {
      ...shift,
      rating,
      comments,
    };
    updateShiftInDB(updatedShift);
    handleClose();
  }

  function handleRatingChange(_: SyntheticEvent, { rating }: any) {
    if (typeof rating === 'number') {
      setRating(rating);
    }
  }

  function handleCommentChange(_: SyntheticEvent, { value }: any) {
    setComments(value);
  }

  return (
    <div onClick={e => e.stopPropagation()}>
      <Modal
        className="Modal ReceiptEditModal"
        onClose={handleClose}
        onOpen={() => setOpen(true)}
        open={open}
        size='small'
        trigger={
          <button
            className='EditShiftModalTrigger ui button icon hover-animation'
            onClick={e => e.stopPropagation()}
          >
            <i className='pencil alternate icon'></i>
          </button>
        }
      >
        <Modal.Header><Header text='Edit Shift' decorated /></Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Form>
              <Rating
                icon='star'
                maxRating={10}
                rating={rating}
                size='large'
                onRate={handleRatingChange}
                clearable
              />
              <TextArea
                placeholder='Write out some thoughts or comments on how everything went'
                rows={5}
                value={comments}
                onChange={handleCommentChange}
              ></TextArea>
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

export default ShiftEditModal;