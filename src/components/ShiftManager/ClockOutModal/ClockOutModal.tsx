import './ClockOutModal.scss';
import { SyntheticEvent, useState } from "react";
import { Form, Modal, Rating, TextArea } from "semantic-ui-react";
import Header from "../../Common/Header";

interface ClockOutModalProps {
  onConfirm: (rating: number, comments: string) => void;
}

function ClockOutModal({ onConfirm }: ClockOutModalProps) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState('');

  function handleConfirm() {
    setOpen(false);
    onConfirm(rating, comments);
  }

  function handleRate(_: SyntheticEvent, { rating }: any) {
    if (typeof rating === 'number') {
      setRating(rating);
    }
  }

  function handleChange(_: SyntheticEvent, { value }: any) {
    setComments(value);
  }

  return (
    <Modal
      className="Modal ClockOutModal"
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size='small'
      trigger={
        <button
          className='ui button negative hover-animation'
        >
          <p className='label contrast'>Clock Out</p>
          <p className='IconContainer contrast'><i className='clock icon'></i></p>
        </button>
      }
    >
      <Modal.Header><Header text='Clock Out' decorated /></Modal.Header>
      <Modal.Content>
        <Modal.Description>
          Before clocking out, please tell us how your shift went!
          <Form>
            <Rating
              icon='star'
              defaultRating={0}
              maxRating={10}
              size='large'
              onRate={handleRate}
              clearable
            />
            <TextArea
              placeholder='Write out some thoughts or comments on how everything went'
              rows={5}
              onChange={handleChange}
            ></TextArea>
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
        >
          <p className='label contrast'>Confirm</p>
          <p className='IconContainer contrast'><i className='check icon'></i></p>
        </button>
      </Modal.Actions>
    </Modal>
  );
}

export default ClockOutModal;