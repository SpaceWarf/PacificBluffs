import './Calendar.scss';
import Header from '../Common/Header';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import AddEventModal from './AddEventModal/AddEventModal';
import { ReactBigCalendarEvent } from '../../state/event';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import EditEventModal from './EditEventModal/EditEventModal';
import ViewEventModal from './ViewEventModal/ViewEventModal';
import { Webhook } from '../../state/webhook';
import { getWebhookById } from '../../utils/firestore';
import { useSearchParams } from 'react-router-dom';

const localizer = dayjsLocalizer(dayjs);

function EventCalendar() {
  const { isAdmin } = useAuth();
  const profile = useSelector((state: RootState) => state.profile);
  const [searchParams, setSearchParams] = useSearchParams();
  const { events } = useSelector((state: RootState) => state.events);
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [slotStart, setSlotStart] = useState<Date>(new Date());
  const [slotEnd, setSlotEnd] = useState<Date>(new Date());
  const [openViewModal, setOpenViewModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [event, setEvent] = useState<ReactBigCalendarEvent | null>(null);
  const [webhook, setWebhook] = useState<Webhook>();

  useEffect(() => {
    const fetchWebhook = async () => {
      setWebhook(await getWebhookById('events-update'));
    }

    if (isAdmin || profile.info.roles.includes('event-assistant')) {
      fetchWebhook();
    }
  }, [isAdmin, profile]);

  useEffect(() => {
    if (searchParams.has('view')) {
      const event = events.find(event => event.id === searchParams.get('view'));

      if (event) {
        setEvent({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        });
        setOpenViewModal(true);
      } else {
        setSearchParams({});
      }
    }
  }, [searchParams, events, setSearchParams]);

  const getEvents = (): ReactBigCalendarEvent[] => {
    return events.map(event => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end),
    }));
  }

  const handleEventSelection = (event: ReactBigCalendarEvent) => {
    setSearchParams({ view: event.id });
    setEvent(event);
    setOpenViewModal(true);
  }

  const handleSelectSlot = (event: any) => {
    if (isAdmin || profile.info.roles.includes('ceremonies-emissary')) {
      setSlotStart(event.start);
      setSlotEnd(event.end);
      setOpenCreateModal(true);
    }
  }

  return (
    <div className="Calendar">
      <Header text="Calendar" decorated />
      <div className='content'>
        {openCreateModal && <AddEventModal
          open={openCreateModal}
          start={slotStart}
          end={slotEnd}
          webhook={webhook}
          onClose={() => setOpenCreateModal(false)}
        />}
        {openViewModal && event && <ViewEventModal
          open={openViewModal}
          event={event}
          webhook={webhook}
          onEdit={() => { setOpenViewModal(false); setOpenEditModal(true); }}
          onClose={() => { setSearchParams({}); setOpenViewModal(false); }}
        />}
        {openEditModal && event && <EditEventModal
          open={openEditModal}
          event={event}
          webhook={webhook}
          onSave={setEvent}
          onClose={() => { setOpenViewModal(true); setOpenEditModal(false); }}
        />}
        <Calendar
          localizer={localizer}
          events={getEvents()}
          onSelectEvent={handleEventSelection}
          onSelectSlot={handleSelectSlot}
          startAccessor="start"
          endAccessor="end"
          views={['month', 'week', 'day']}
          eventPropGetter={(event: ReactBigCalendarEvent) => {
            const data = events.find(ev => ev.id === event.id);
            const isPast = dayjs(data?.end).isBefore(dayjs());
            const backgroundColor = data && data.color;
            return { style: { backgroundColor, opacity: isPast ? 0.5 : 1 } };
          }}
          selectable
        />
      </div>
    </div>
  );
}

export default EventCalendar;
