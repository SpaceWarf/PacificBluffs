import './UpcomingEventsCard.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getEventsDateMap } from '../../../redux/selectors/events';
import { ReactElement, useEffect, useState } from 'react';
import { CalendarEvent, ReactBigCalendarEvent } from '../../../state/event';
import ViewEventModal from '../../Calendar/ViewEventModal/ViewEventModal';
import { Webhook } from '../../../state/webhook';
import { getWebhookById } from '../../../utils/firestore';
import { useAuth } from '../../../contexts/AuthContext';
import EditEventModal from '../../Calendar/EditEventModal/EditEventModal';
import { getTimeString } from '../../../utils/time';

function UpcomingEventsCard() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const eventMap = useSelector(getEventsDateMap);
  const [openViewModal, setOpenViewModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [event, setEvent] = useState<ReactBigCalendarEvent | null>(null);
  const [webhook, setWebhook] = useState<Webhook>();

  useEffect(() => {
    const fetchWebhook = async () => {
      setWebhook(await getWebhookById('event-update'));
    }

    if (isAdmin) {
      fetchWebhook();
    }
  }, [isAdmin]);

  const getComponents = (): ReactElement[] => {
    const components: ReactElement[] = [];
    eventMap.forEach((value, key) => {
      components.push(
        <div className='DateContainer'>
          <p className='DateLabel'>{key}</p>
          <div className='Events'>
            {value.map(event => (
              <div
                className='Event'
                style={{ backgroundColor: event.color }}
                onClick={() => handleViewEvent(event)}
              >
                <p>{event.title}</p>
                <p>{getTimeString(new Date(event.start))} - {getTimeString(new Date(event.end))}</p>
              </div>
            ))}
          </div>
        </div>
      );
    });
    return components;
  }

  const handleViewEvent = (event: CalendarEvent) => {
    setEvent({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end),
    });
    setOpenViewModal(true);
  }

  return (
    <div className="UpcomingEventsCard ui card attached external">
      <div className="content">
        <div className='header'>
          <p><i className='calendar alternate icon' /> Upcoming Events</p>
          <button className="ui icon button" onClick={() => navigate('/calendar')}>
            <i className='external alternate icon' />
          </button>
        </div>
        {openViewModal && event && <ViewEventModal
          open={openViewModal}
          event={event}
          webhook={webhook}
          onEdit={() => setOpenEditModal(true)}
          onClose={() => setOpenViewModal(false)}
        />}
        {openEditModal && event && <EditEventModal
          open={openEditModal}
          event={event}
          webhook={webhook}
          onSave={setEvent}
          onClose={() => setOpenEditModal(false)}
        />}
        {getComponents().length ? (
          getComponents()
        ) : (
          <p>Nothing to show...</p>
        )}
      </div>
    </div>
  );
}

export default UpcomingEventsCard;
