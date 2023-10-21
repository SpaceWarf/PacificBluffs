import "./AddEventModal.scss";
import { Checkbox, Modal } from "semantic-ui-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import Input from "../../Common/Input";
import { EVENT_COLORS } from "../../../state/event";
import Dropdown from "../../Common/Dropdown";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider, DateTimePicker, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { createEvent } from "../../../utils/firestore";
import { Webhook } from "../../../state/webhook";
import { triggerDiscordWebhook } from "../../../services/functions";
import Textarea from "../../Common/Textarea";

interface AddEventModalProps {
  open: boolean,
  start: Date,
  end: Date,
  webhook?: Webhook,
  onClose: () => void
}

function AddEventModal(props: AddEventModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [color, setColor] = useState<string>(EVENT_COLORS[2].value);
  const [start, setStart] = useState<Dayjs>(dayjs(props.start));
  const [end, setEnd] = useState<Dayjs>(dayjs(props.end));
  const [allDay, setAllDay] = useState<boolean>(false);
  const [notification, setNotification] = useState<boolean>(true);
  const [poster, setPoster] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [dateError, setDateError] = useState<boolean>(false);

  useEffect(() => {
    setStart(dayjs(props.start));
    setEnd(dayjs(props.end));
  }, [props]);

  const handleAdd = async () => {
    setLoading(true);
    await createEvent({
      title,
      color,
      start: start.toISOString(),
      end: end.toISOString(),
      allDay,
      poster,
      notes,
    }, user);
    setLoading(false);

    if (notification) {
      sendWebhook();
    }

    handleClose();
  }

  const handleClose = () => {
    clear();
    props.onClose();
  }

  const sendWebhook = () => {
    if (props.webhook) {
      triggerDiscordWebhook({
        url: props.webhook.url,
        content: `@everyone A new event was created`,
        embeds: [
          {
            type: "rich",
            title: title,
            description: "",
            fields: [
              {
                name: 'Starts On',
                value: `\n<t:${start.toDate().getTime() / 1000}:F>`,
                inline: true
              },
              {
                name: 'Ends On',
                value: `\n<t:${end.toDate().getTime() / 1000}:F>`,
                inline: true
              }
            ]
          }
        ]
      }).catch(error => {
        console.error(error);
      });
    }
  }

  const clear = () => {
    setTitle('');
    setColor(EVENT_COLORS[0].value);
    setStart(dayjs(props.start));
    setEnd(dayjs(props.end));
    setAllDay(false);
    setPoster('');
    setNotes('');
  }

  const canAdd = (): boolean => {
    return !!title && !!start && !!end && !!color && start.isBefore(end);
  }

  const handleUpdateStart = (start: Dayjs) => {
    setDateError(false);
    setStart(start);

    if (!start.isBefore(end)) {
      setDateError(true);
    }
  }

  const handleUpdateEnd = (end: Dayjs) => {
    setDateError(false);
    setEnd(end);

    if (!start.isBefore(end)) {
      setDateError(true);
    }
  }

  return (
    <Modal
      className="AddEventModal Modal"
      size="small"
      onClose={handleClose}
      open={props.open}
    >
      <Modal.Header>Add an event</Modal.Header>
      <Modal.Content>
        <div className='ui form'>
          <div className="Row">
            <Input
              type="text"
              name="title"
              placeholder="Title *"
              icon="edit outline"
              value={title}
              onChange={setTitle}
              disabled={loading}
            />
            <div className="field-container">
              <Checkbox
                checked={allDay}
                label="All Day?"
                toggle
                onChange={() => setAllDay(!allDay)}
              />
              <Checkbox
                checked={notification}
                label="Send Notification?"
                toggle
                onChange={() => setNotification(!notification)}
              />
            </div>
          </div>
          <div className="Row">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {allDay ? (
                <DatePicker
                  label="Event Start *"
                  value={start}
                  onChange={value => setStart(dayjs(value))}
                />
              ) : (
                <DateTimePicker
                  label="Event Start *"
                  value={start}
                  onChange={value => handleUpdateStart(dayjs(value))}
                />
              )}
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {allDay ? (
                <DatePicker
                  label="Event End *"
                  value={end}
                  onChange={value => handleUpdateEnd(dayjs(value))}
                />
              ) : (
                <DateTimePicker
                  label="Event End *"
                  value={end}
                  onChange={value => handleUpdateEnd(dayjs(value))}
                />
              )}
            </LocalizationProvider>
          </div>
          <div className="Row">
            <Input
              type="text"
              name="poster"
              placeholder="Poster URL"
              icon="picture outline"
              value={poster}
              onChange={setPoster}
              disabled={loading}
            />
            <Dropdown
              placeholder="Color *"
              disabled={loading}
              options={EVENT_COLORS}
              value={color}
              onChange={(_, { value }) => setColor(value)}
            />
          </div>
          <div className="Row">
            <Textarea
              name="notes"
              placeholder="Notes"
              value={notes}
              onChange={setNotes}
              disabled={loading}
            />
          </div>
        </div>
        {dateError && (
          <p className="error">Error: The event's end date must be after its start date.</p>
        )}
      </Modal.Content>
      <Modal.Actions>
        <button className="ui button negative hover-animation" onClick={handleClose}>
          <p className='label contrast'>Cancel</p>
          <p className='IconContainer contrast'><i className='close icon'></i></p>
        </button>
        <button className="ui button positive hover-animation" disabled={!canAdd()} onClick={handleAdd}>
          <p className='label contrast'>Confirm</p>
          <p className='IconContainer contrast'><i className='check icon'></i></p>
        </button>
      </Modal.Actions>
    </Modal>
  );
}

export default AddEventModal;