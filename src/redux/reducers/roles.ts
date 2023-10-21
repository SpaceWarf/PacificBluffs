import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Role {
  id: string;
  name: string;
  division: string;
}

export interface RolesState {
  roles: Role[];
}

const initialState: RolesState = {
  roles: [],
};

export const roles = createSlice({
  name: 'Roles',
  initialState: initialState,
  reducers: {
    setRoles: (state, action: PayloadAction<Role[]>) => {
      state.roles = action.payload;
    },
  },
});

export const { setRoles } = roles.actions;
export default roles.reducer;