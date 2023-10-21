import { CalendarEvent } from "../../state/event";
import { getDateString } from "../../utils/time";
import { RootState } from "../store";

export function getEventsDateMap(state: RootState): Map<string, CalendarEvent[]> {
  const map = new Map<string, CalendarEvent[]>();
  [...state.events.events]
    .filter(event => new Date(event.end).getTime() >= new Date().getTime())
    .sort((a, b) => new Date(a.start || '').getTime() - new Date(b.start || '').getTime())
    .slice(0, 10)
    .forEach(event => {
      const date = getDateString(new Date(event.start));

      if (map.has(date)) {
        map.set(date, [...map.get(date) || [], event])
      } else {
        map.set(date, [event]);
      }
    });
  return map;
}