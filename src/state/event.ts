import { DropdownOption } from "../components/Common/Dropdown";
import { FirestoreEntity } from "../utils/firestore";

export interface CalendarEvent extends FirestoreEntity {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay?: boolean;
  color: string;
  poster?: string;
  notes?: string;
}

export interface ReactBigCalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  color: string;
  poster?: string;
  notes?: string;
}

export interface CalendarEventUpdate {
  title: string;
  start: string;
  end: string;
  allDay?: boolean;
  color: string;
  poster?: string;
  notes?: string;
}

export const EVENT_COLORS: DropdownOption[] = [
  { key: 'red', value: 'red', text: 'Red' },
  { key: 'blue', value: 'cornflowerblue', text: 'Blue' },
  { key: 'green', value: 'seagreen', text: 'Green' },
  { key: 'pink', value: 'hotpink', text: 'Pink' },
  { key: 'purple', value: 'mediumorchid', text: 'Purple' },
  { key: 'coral', value: 'coral', text: 'Orange' },
  { key: 'gray', value: 'gray', text: 'Gray' },
]