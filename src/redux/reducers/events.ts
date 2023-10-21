import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CalendarEvent } from "../../state/event";

export interface EventsState {
  events: CalendarEvent[];
}

const initialState: EventsState = {
  events: [],
};

export const events = createSlice({
  name: 'Events',
  initialState: initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<CalendarEvent[]>) => {
      state.events = action.payload;
    },
  },
});

export const { setEvents } = events.actions;
export default events.reducer;