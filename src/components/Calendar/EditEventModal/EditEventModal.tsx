import "./EditEventModal.scss";
import { Checkbox, Modal } from "semantic-ui-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import Input from "../../Common/Input";
import { EVENT_COLORS, ReactBigCalendarEvent } from "../../../state/event";
import Dropdown from "../../Common/Dropdown";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider, DateTimePicker, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { updateEvent } from "../../../utils/firestore";
import { Webhook } from "../../../state/webhook";
import { triggerDiscordWebhook } from "../../../services/functions";
import Textarea from "../../Common/Textarea";

interface EditEventModalProps {
  open: boolean,
  event: ReactBigCalendarEvent,
  webhook?: Webhook,
  onSave: (event: ReactBigCalendarEvent) => void,
  onClose: () => void,
}

function EditEventModal(props: EditEventModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(props.event.title);
  const [color, setColor] = useState<string>(props.event.color);
  const [start, setStart] = useState<Dayjs>(dayjs(props.event.start));
  const [end, setEnd] = useState<Dayjs>(dayjs(props.event.end));
  const [allDay, setAllDay] = useState<boolean>(props.event.allDay || false);
  const [notification, setNotification] = useState<boolean>(false);
  const [poster, setPoster] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    setTitle(props.event.title);
    setColor(props.event.color);
    setStart(dayjs(props.event.start));
    setEnd(dayjs(props.event.end));
    setAllDay(props.event.allDay || false);
    setPoster(props.event.poster || '');
    setNotes(props.event.notes || '');
  }, [props]);

  const handleSave = async () => {
    setLoading(true);
    await updateEvent(
      props.event.id,
      {
        title,
        color,
        start: start.toISOString(),
        end: end.toISOString(),
        allDay,
        poster,
        notes,
      },
      user
    );
    setLoading(false);
    props.onSave({
      id: props.event.id,
      title,
      color,
      start: start.toDate(),
      end: end.toDate(),
      allDay,
      poster,
      notes,
    });

    if (notification) {
      sendWebhook();
    }

    handleClose();
  }

  const handleClose = () => {
    setTitle(props.event.title);
    setColor(props.event.color);
    setStart(dayjs(props.event.start));
    setEnd(dayjs(props.event.end));
    setAllDay(props.event.allDay || false);
    setPoster(props.event.poster || '');
    setNotes(props.event.notes || '');
    props.onClose();
  }

  const canSave = (): boolean => {
    const hasRequired = !!title
      && !!start
      && !!end
      && !!color
      && start.isBefore(end);
    const isEdited = title !== props.event.title
      || start.toISOString() !== props.event.start.toISOString()
      || end.toISOString() !== props.event.end.toISOString()
      || color !== props.event.color
      || poster !== props.event.poster
      || notes !== props.event.notes;
    return hasRequired && isEdited;
  }

  const handleUpdateStart = (start: Dayjs) => {
    if (end.isBefore(start)) {
      setEnd(start.add(1, 'hour'));
    }
    setStart(start);
  }

  const handleUpdateEnd = (end: Dayjs) => {
    if (end.isBefore(start)) {
      setStart(end.subtract(1, 'hour'));
    }
    setEnd(end);
  }


  const sendWebhook = () => {
    if (props.webhook) {
      triggerDiscordWebhook({
        url: props.webhook.url,
        content: `@everyone An event was edited`,
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

  return (
    <Modal
      className="EditEventModal Modal"
      size="small"
      onClose={handleClose}
      open={props.open}
    >
      <Modal.Header>Edit event</Modal.Header>
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
                  disabled={loading}
                  onChange={value => handleUpdateStart(dayjs(value))}
                />
              ) : (
                <DateTimePicker
                  label="Event Start *"
                  value={start}
                  disabled={loading}
                  onChange={value => handleUpdateStart(dayjs(value))}
                />
              )}
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {allDay ? (
                <DatePicker
                  label="Event End *"
                  value={end}
                  disabled={loading}
                  onChange={value => handleUpdateEnd(dayjs(value))}
                />
              ) : (
                <DateTimePicker
                  label="Event End *"
                  value={end}
                  disabled={loading}
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
      </Modal.Content>
      <Modal.Actions>
        <button className="ui button negative hover-animation" onClick={handleClose}>
          <p className='label contrast'>Cancel</p>
          <p className='IconContainer contrast'><i className='close icon'></i></p>
        </button>
        <button className="ui button positive hover-animation" disabled={!canSave()} onClick={handleSave}>
          <p className='label contrast'>Save</p>
          <p className='IconContainer contrast'><i className='check icon'></i></p>
        </button>
      </Modal.Actions>
    </Modal>
  );
}

export default EditEventModal;