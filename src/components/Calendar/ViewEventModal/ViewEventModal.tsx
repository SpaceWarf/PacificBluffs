import "./ViewEventModal.scss";
import { Modal } from "semantic-ui-react";
import { ReactBigCalendarEvent } from "../../../state/event";
import dayjs from "dayjs";
import { LocalizationProvider, DateTimePicker, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useAuth } from "../../../contexts/AuthContext";
import { deleteEvent } from "../../../utils/firestore";
import { Webhook } from "../../../state/webhook";
import { triggerDiscordWebhook } from "../../../services/functions";
import Textarea from "../../Common/Textarea";

interface ViewEventModalProps {
  open: boolean,
  event: ReactBigCalendarEvent,
  webhook?: Webhook,
  onEdit: () => void
  onClose: () => void
}

function ViewEventModal(props: ViewEventModalProps) {
  const { user, isAdmin } = useAuth();

  const handleDelete = async () => {
    await deleteEvent(props.event.id, user);
    props.onClose();
  }

  const sendWebhook = () => {
    if (props.webhook) {
      triggerDiscordWebhook({
        url: props.webhook.url,
        content: `@everyone Event reminder`,
        embeds: [
          {
            type: "rich",
            title: props.event.title,
            description: "",
            fields: [
              {
                name: 'Starts On',
                value: `\n<t:${props.event.start.getTime() / 1000}:F>`,
                inline: true
              },
              {
                name: 'Ends On',
                value: `\n<t:${props.event.end.getTime() / 1000}:F>`,
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
      className="ViewEventModal Modal"
      size="small"
      onClose={props.onClose}
      open={props.open}
    >
      <Modal.Header>
        <div className="Title">
          <div className="Label" style={{ backgroundColor: props.event.color }} />
          {props.event.title}
        </div>
        {isAdmin && (
          <div className="Actions">
            <button className="ui icon button" disabled={!props.webhook} onClick={sendWebhook}>
              <i className="discord icon" />
            </button>
            <button className="ui icon button" onClick={props.onEdit}>
              <i className="pencil icon" />
            </button>
            <button className="ui icon negative button" onClick={handleDelete}>
              <i className="trash icon" />
            </button>
          </div>
        )}
      </Modal.Header>
      <Modal.Content>
        <div className='ui form'>
          <div className="Row">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {props.event.allDay ? (
                <DatePicker
                  label="Starts On"
                  value={dayjs(props.event.start)}
                  disabled
                />
              ) : (
                <DateTimePicker
                  label="Starts On"
                  value={dayjs(props.event.start)}
                  disabled
                />
              )}
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {props.event.allDay ? (
                <DatePicker
                  label="Ends On"
                  value={dayjs(props.event.end)}
                  disabled
                />
              ) : (
                <DateTimePicker
                  label="Ends On"
                  value={dayjs(props.event.end)}
                  disabled
                />
              )}
            </LocalizationProvider>
          </div>
          <div className="Row">
            <div>
              <Textarea
                name="notes"
                placeholder="Notes"
                value={props.event.notes || ''}
                disabled
              />
            </div>
            {props.event.poster && <img className="Poster" src={props.event.poster} alt="Poster" />}
          </div>
          {props.event.poster && (
            <div className="Row PosterRow">
            </div>
          )}
        </div>
      </Modal.Content>
    </Modal>
  );
}

export default ViewEventModal;