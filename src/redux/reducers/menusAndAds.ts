import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum MenuOrAdType {
  MENU = 'menu',
  AD = 'ad',
}

export interface MenuOrAd {
  id: string;
  name: string;
  url: string;
  type: MenuOrAdType;
}

export interface MenusAndAdsState {
  menus: MenuOrAd[];
  ads: MenuOrAd[];
}

const initialState: MenusAndAdsState = {
  menus: [],
  ads: []
};

export const menusAndAds = createSlice({
  name: 'MenusAndAds',
  initialState: initialState,
  reducers: {
    setMenus: (state, action: PayloadAction<MenuOrAd[]>) => {
      state.menus = action.payload;
    },
    setAds: (state, action: PayloadAction<MenuOrAd[]>) => {
      state.ads = action.payload;
    },
  },
});

export const { setMenus, setAds } = menusAndAds.actions;
export default menusAndAds.reducer;