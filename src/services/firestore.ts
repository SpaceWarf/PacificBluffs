import { BehaviorSubject } from "rxjs";
import {
  getCombos,
  getIngredients,
  onIngredientsSnapshot,
  getMenuItems,
  getMenusAndAds,
  getProfileById,
  getReceiptsForEmployee,
  getShiftsForEmployee,
  onMenuItemsSnapshot,
  onCombosSnapshot,
  onProfileByIdSnapshot,
  onShiftsForEmployeeSnapshot,
  onReceiptsForEmployeeSnapshot,
  onMenusAndAdsSnapshot,
  getDivisions,
  getRoles,
  getEvents,
  onEventsSnapshot
} from "../utils/firestore";
import { Dispatch } from "react";
import { AnyAction } from "@reduxjs/toolkit";
import { setCombos, setMenuItems } from "../redux/reducers/menuItems";
import { setIngredients } from "../redux/reducers/ingredients";
import { setMenus, setAds } from "../redux/reducers/menusAndAds";
import { setPfpUrl, setProfile } from "../redux/reducers/profile";
import { setReceipts } from "../redux/reducers/receipts";
import { setShifts } from "../redux/reducers/shifts";
import { getProfilePictureUrl } from "../utils/storage";
import { setRoles } from "../redux/reducers/roles";
import { setDivisions } from "../redux/reducers/divisions";
import { setEvents } from "../redux/reducers/events";

export const loadingSubject = new BehaviorSubject<boolean>(true);

export async function loadData(id: string, dispatch: Dispatch<AnyAction>) {
  const [
    menuItems,
    combos,
    ingredients,
    profile,
    shifts,
    receipts,
    menusAndAds,
    divisions,
    roles,
    events,
  ] = await Promise.all([
    getMenuItems(),
    getCombos(),
    getIngredients(),
    getProfileById(id),
    getShiftsForEmployee(id),
    getReceiptsForEmployee(id),
    getMenusAndAds(),
    getDivisions(),
    getRoles(),
    getEvents(),
  ]);
  dispatch(setMenuItems(menuItems));
  dispatch(setCombos(combos));
  dispatch(setIngredients(ingredients));
  dispatch(setProfile(profile));
  dispatch(setShifts(shifts));
  dispatch(setReceipts(receipts));
  dispatch(setMenus(menusAndAds.menus));
  dispatch(setAds(menusAndAds.ads));
  dispatch(setRoles(roles));
  dispatch(setDivisions(divisions));
  dispatch(setEvents(events));

  if (profile.pfp) {
    const url = await getProfilePictureUrl(profile.pfp);
    dispatch(setPfpUrl(url));
  }

  onMenuItemsSnapshot(menuItems => dispatch(setMenuItems(menuItems)));
  onCombosSnapshot(combos => dispatch(setCombos(combos)));
  onIngredientsSnapshot(ingredients => dispatch(setIngredients(ingredients)));
  onProfileByIdSnapshot(id, profile => dispatch(setProfile(profile)));
  onShiftsForEmployeeSnapshot(id, shifts => dispatch(setShifts(shifts)));
  onReceiptsForEmployeeSnapshot(id, receipts => dispatch(setReceipts(receipts)));
  onMenusAndAdsSnapshot(menusAndAds => {
    dispatch(setMenus(menusAndAds.menus));
    dispatch(setAds(menusAndAds.ads));
  });
  onEventsSnapshot(events => dispatch(setEvents(events)));

  loadingSubject.next(false);
}