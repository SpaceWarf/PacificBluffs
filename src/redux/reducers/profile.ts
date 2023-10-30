import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ProfileState {
  info: ProfileInfo;
  pfpUrl: string;
}

export interface ProfileInfo {
  id: string;
  name: string;
  ssn: string;
  phone: string;
  bleeter: string;
  email: string;
  bank: string;
  admin: boolean;
  clockedIn: boolean;
  pfp: string;
  division: string;
  roles: string[];
}

const initialState: ProfileState = {
  info: {
    id: '',
    name: '',
    ssn: '',
    phone: '',
    bleeter: '',
    email: '',
    bank: '',
    admin: false,
    clockedIn: false,
    pfp: '',
    division: '',
    roles: [],
  },
  pfpUrl: '',
};

export const profile = createSlice({
  name: 'Profile',
  initialState: initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<ProfileInfo>) => {
      state.info = action.payload;
    },
    setClockedIn: (state, action: PayloadAction<boolean>) => {
      state.info.clockedIn = action.payload;
    },
    setPfpUrl: (state, action: PayloadAction<string>) => {
      state.pfpUrl = action.payload;
    },
  },
});

export const { setProfile, setClockedIn, setPfpUrl } = profile.actions;
export default profile.reducer;