import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Division {
  id: string;
  name: string;
  hierarchy: number;
}

export interface DivisionsState {
  divisions: Division[];
}

const initialState: DivisionsState = {
  divisions: [],
};

export const divisions = createSlice({
  name: 'Divisions',
  initialState: initialState,
  reducers: {
    setDivisions: (state, action: PayloadAction<Division[]>) => {
      state.divisions = action.payload;
    },
  },
});

export const { setDivisions } = divisions.actions;
export default divisions.reducer;