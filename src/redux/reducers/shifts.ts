import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ShiftsState {
  shifts: Shift[];
}

export interface Shift {
  id?: string;
  employee: string;
  start: string;
  end: string;
  rating?: number;
  comments?: string;
}

const initialState: ShiftsState = {
  shifts: []
};

export const profile = createSlice({
  name: 'Shifts',
  initialState: initialState,
  reducers: {
    setShifts: (state, action: PayloadAction<Shift[]>) => {
      state.shifts = action.payload;
    },
    addShift: (state, action: PayloadAction<Shift>) => {
      state.shifts.push(action.payload);
    },
    updateCurrentShift: (state, action: PayloadAction<Partial<Shift>>) => {
      const index = state.shifts.findIndex(shift => !shift.end);
      const shift = state.shifts[index];
      state.shifts[index] = {...shift, ...action.payload};
    },
    updateShift(state, action: PayloadAction<Shift>) {
      const index = state.shifts.findIndex(shift => shift.id === action.payload.id);
      state.shifts[index] = action.payload;
    },
  },
});

export const { setShifts, addShift, updateCurrentShift, updateShift } = profile.actions;
export default profile.reducer;