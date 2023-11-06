import { DocumentData, addDoc, collection, doc, getDoc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { db } from "../config/firebase";
import { Combo, MenuItem, ComboItem, Ingredient, RecipeItem, Service } from "../redux/reducers/menuItems";
import { ProfileInfo } from "../redux/reducers/profile";
import { Shift } from "../redux/reducers/shifts";
import { Receipt } from "../redux/reducers/receipts";
import { MenuOrAdType, MenusAndAdsState } from "../redux/reducers/menusAndAds";
import { Unsubscribe, User } from "firebase/auth";
import { Division } from "../redux/reducers/divisions";
import { Role } from "../redux/reducers/roles";
import { CalendarEvent, CalendarEventUpdate } from "../state/event";
import { Webhook } from "../state/webhook";

export interface FirestoreEntity {
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
  deleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
}

const menuItemsRef = collection(db, "menu-items");
const combosRef = collection(db, "combos");
const ingredientsRef = collection(db, "ingredients");
const profilesRef = collection(db, "profiles");
const shiftsRef = collection(db, "shifts");
const receiptsRef = collection(db, "receipts");
const menusAndAdsRef = collection(db, "menus-and-ads");
const rolesRef = collection(db, "roles");
const divisionRef = collection(db, "divisions");
const eventsRef = collection(db, "events");
const servicesRef = collection(db, "services");

export async function getMenuItems(): Promise<MenuItem[]> {
  const snapshot = await getDocs(menuItemsRef);
  const items: MenuItem[] = [];
  snapshot.forEach((doc: DocumentData) => {
    items.push(getMenuItemFromDocumentData(doc));
  });
  return items;
}

export function onMenuItemsSnapshot(cb: (items: MenuItem[]) => void): Unsubscribe {
  return onSnapshot(menuItemsRef, {}, snapshot => {
    const items: MenuItem[] = [];
    snapshot.forEach((doc: DocumentData) => {
      items.push(getMenuItemFromDocumentData(doc));
    });
    cb(items);
  });
}

function getMenuItemFromDocumentData(doc: DocumentData): MenuItem {
  return {
    id: doc.id,
    ...doc.data(),
    recipe: mapDbValueToItemArray<RecipeItem>(doc.data().recipe),
  }
}

export async function updateMenuItemStock(id: string, stock: number): Promise<void> {
  await updateDoc(doc(db, "menu-items", id), { stock });
}

export async function getCombos(): Promise<Combo[]> {
  const snapshot = await getDocs(combosRef);
  const combos: Combo[] = [];
  snapshot.forEach((doc: DocumentData) => {
    combos.push(getComboFromDocumentData(doc));
  });
  return combos;
}

export function onCombosSnapshot(cb: (combos: Combo[]) => void): Unsubscribe {
  return onSnapshot(combosRef, {}, snapshot => {
    const combos: Combo[] = [];
    snapshot.forEach((doc: DocumentData) => {
      combos.push(getComboFromDocumentData(doc));
    });
    cb(combos);
  });
}

function getComboFromDocumentData(doc: DocumentData): Combo {
  return {
    id: doc.id,
    ...doc.data(),
    items: mapDbValueToItemArray<ComboItem>(doc.data().items),
  }
}

export async function getServices(): Promise<Service[]> {
  const snapshot = await getDocs(servicesRef);
  const services: Service[] = [];
  snapshot.forEach((doc: DocumentData) => {
    services.push({
      id: doc.id,
      ...doc.data(),
    });
  });
  return services;
}

export function onServicesSnapshot(cb: (services: Service[]) => void): Unsubscribe {
  return onSnapshot(servicesRef, {}, snapshot => {
    const services: Service[] = [];
    snapshot.forEach((doc: DocumentData) => {
      services.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    cb(services);
  });
}

function mapDbValueToItemArray<T>(dbValue: Object): T[] {
  const items: T[] = [];
  Object.entries(dbValue).forEach(([key, value]) => {
    items.push({ id: key, quantity: value } as T);
  });
  return items;
}

export async function getIngredients(): Promise<Ingredient[]> {
  const snapshot = await getDocs(ingredientsRef);
  const ingredients: Ingredient[] = [];
  snapshot.forEach((doc: DocumentData) => {
    ingredients.push(getIngredientFromDocumentData(doc));
  });
  return ingredients;
}

export function onIngredientsSnapshot(cb: (ingredients: Ingredient[]) => void): Unsubscribe {
  return onSnapshot(ingredientsRef, {}, snapshot => {
    const ingredients: Ingredient[] = [];
    snapshot.forEach((doc: DocumentData) => {
      ingredients.push(getIngredientFromDocumentData(doc));
    });
    cb(ingredients);
  });
}

function getIngredientFromDocumentData(doc: DocumentData): Ingredient {
  return doc.data().recipe
    ? {
      id: doc.id,
      ...doc.data(),
      recipe: mapDbValueToItemArray<RecipeItem>(doc.data().recipe),
    }
    : { id: doc.id, ...doc.data() };
}

export async function updateIngredientStock(id: string, stock: number): Promise<void> {
  await updateDoc(doc(db, "ingredients", id), { stock });
}

export async function getProfiles(): Promise<ProfileInfo[]> {
  const snapshot = await getDocs(profilesRef);
  const profiles: ProfileInfo[] = [];
  snapshot.forEach((doc: DocumentData) => {
    profiles.push({ id: doc.id, ...doc.data() });
  });
  return profiles;
}

export function onProfilesSnapshot(cb: (profile: ProfileInfo[]) => void): Unsubscribe {
  return onSnapshot(profilesRef, {}, snapshot => {
    const profiles: ProfileInfo[] = [];
    snapshot.forEach((doc: DocumentData) => {
      profiles.push({ id: doc.id, ...doc.data() });
    });
    cb(profiles);
  });
}

export async function getProfileById(id: string): Promise<ProfileInfo> {
  const snapshot = await getDoc(doc(db, "profiles", id));
  return { id: snapshot.id, ...snapshot.data() } as ProfileInfo;
}

export function onProfileByIdSnapshot(id: string, cb: (profile: ProfileInfo) => void): Unsubscribe {
  return onSnapshot(doc(db, "profiles", id), {}, snapshot => {
    cb({ id: snapshot.id, ...snapshot.data() } as ProfileInfo);
  });
}

export async function updateProfileInfo(id: string, profile: ProfileInfo): Promise<void> {
  const update: Partial<ProfileInfo> = { ...profile };
  delete update.id;
  await updateDoc(doc(db, "profiles", id), { ...update });
}

export async function getProfilesClockedIn(): Promise<Partial<ProfileInfo>[]> {
  const snapshot = await getDocs(query(profilesRef, where('clockedIn', '==', true)));
  const profiles: Partial<ProfileInfo>[] = [];
  snapshot.forEach((doc: DocumentData) => {
    profiles.push({
      id: doc.id,
      name: doc.data().name,
    });
  });
  return profiles;
}

export async function getIsAdmin(id: string): Promise<boolean> {
  const snapshot = await getDoc(doc(db, "profiles", id));
  return snapshot.data()?.admin;
}

export async function updateProfileClockedIn(id: string, clockedIn: boolean): Promise<void> {
  await updateDoc(doc(db, "profiles", id), { clockedIn });
}

export async function getShiftsForEmployee(id: string): Promise<Shift[]> {
  const snapshot = await getDocs(query(shiftsRef, where('employee', '==', id)));
  const shifts: Shift[] = [];
  snapshot.forEach((doc: DocumentData) => {
    shifts.push({ id: doc.id, ...doc.data(), });
  });
  return shifts;
}

export function onShiftsForEmployeeSnapshot(id: string, cb: (shifts: Shift[]) => void): Unsubscribe {
  return onSnapshot(query(shiftsRef, where('employee', '==', id)), {}, snapshot => {
    const shifts: Shift[] = [];
    snapshot.forEach((doc: DocumentData) => {
      shifts.push({ id: doc.id, ...doc.data() });
    });
    cb(shifts);
  });
}

export async function createShift(shift: Shift): Promise<Shift> {
  const doc = await addDoc(shiftsRef, { ...shift });
  return {
    ...shift,
    id: doc.id
  }
}

export async function updateShift(shift: Shift): Promise<void> {
  if (shift.id) {
    const update = { ...shift };
    delete update.id;
    await updateDoc(doc(db, "shifts", shift.id), update);
  }
}

export async function updateEmployeeCurrentShift(employee: string, shift: Partial<Shift>): Promise<void> {
  const snapshot = await getDocs(query(shiftsRef, where('employee', '==', employee), where('end', '==', '')));
  const document = snapshot.docs[0];
  if (document) {
    await updateDoc(doc(db, "shifts", document.id), { ...shift });
  }
}

export async function getReceiptsForEmployee(id: string): Promise<Receipt[]> {
  const snapshot = await getDocs(query(receiptsRef, where('employee', '==', id)));
  const receipts: Receipt[] = [];
  snapshot.forEach((doc: DocumentData) => {
    receipts.push({ id: doc.id, ...doc.data(), });
  });
  return receipts
}

export function onReceiptsForEmployeeSnapshot(id: string, cb: (receipts: Receipt[]) => void): Unsubscribe {
  return onSnapshot(query(receiptsRef, where('employee', '==', id)), {}, snapshot => {
    const receipts: Receipt[] = [];
    snapshot.forEach((doc: DocumentData) => {
      receipts.push({ id: doc.id, ...doc.data() });
    });
    cb(receipts);
  });
}

export async function createReceipt(receipt: Receipt): Promise<Receipt> {
  const doc = await addDoc(receiptsRef, { ...receipt });
  return {
    ...receipt,
    id: doc.id,
  }
}

export async function updateReceipt(receipt: Receipt): Promise<void> {
  if (receipt.id) {
    const update = { ...receipt };
    delete update.id;
    await updateDoc(doc(db, "receipts", receipt.id), update);
  }
}

export async function getMenusAndAds(): Promise<MenusAndAdsState> {
  const snapshot = await getDocs(menusAndAdsRef);
  const menusAndAds: MenusAndAdsState = {
    menus: [],
    ads: [],
  };
  snapshot.forEach((doc: DocumentData) => {
    const type = doc.data().type;
    const item = { id: doc.id, ...doc.data() };
    if (type === MenuOrAdType.MENU) {
      menusAndAds.menus.push(item);
    }

    if (type === MenuOrAdType.AD) {
      menusAndAds.ads.push(item);
    }
  });
  return menusAndAds;
}

export function onMenusAndAdsSnapshot(cb: (menusAndAds: MenusAndAdsState) => void): Unsubscribe {
  return onSnapshot(menusAndAdsRef, {}, snapshot => {
    const menusAndAds: MenusAndAdsState = {
      menus: [],
      ads: [],
    };
    snapshot.forEach((doc: DocumentData) => {
      const type = doc.data().type;
      const item = { id: doc.id, ...doc.data() };
      if (type === MenuOrAdType.MENU) {
        menusAndAds.menus.push(item);
      }

      if (type === MenuOrAdType.AD) {
        menusAndAds.ads.push(item);
      }
    });
    cb(menusAndAds);
  });
}

export async function getDivisions(): Promise<Division[]> {
  const snapshot = await getDocs(divisionRef);
  const divisions: Division[] = [];
  snapshot.forEach((doc: DocumentData) => {
    divisions.push({ id: doc.id, ...doc.data() });
  });
  return divisions;
}

export async function getRoles(): Promise<Role[]> {
  const snapshot = await getDocs(rolesRef);
  const roles: Role[] = [];
  snapshot.forEach((doc: DocumentData) => {
    roles.push({ id: doc.id, ...doc.data() });
  });
  return roles;
}


export async function getEvents(): Promise<CalendarEvent[]> {
  const snapshot = await getDocs(eventsRef);
  const wars: CalendarEvent[] = [];
  snapshot.forEach((doc: DocumentData) => {
    const data = doc.data();
    if (!data.deleted) {
      wars.push({ id: doc.id, ...data });
    }
  });
  return wars;
}

export function onEventsSnapshot(cb: (wars: CalendarEvent[]) => void): Unsubscribe {
  return onSnapshot(eventsRef, {}, snapshot => {
    const wars: CalendarEvent[] = [];
    snapshot.forEach((doc: DocumentData) => {
      const data = doc.data();
      if (!data.deleted) {
        wars.push({ id: doc.id, ...data });
      }
    });
    cb(wars);
  });
}

export async function createEvent(event: CalendarEventUpdate, user: User | null): Promise<CalendarEvent> {
  const now = new Date().toISOString();
  const doc = await addDoc(eventsRef, {
    ...event,
    createdAt: now,
    createdBy: user?.uid ?? '',
  });
  return {
    id: doc.id,
    ...event,
  };
}

export async function updateEvent(id: string, update: CalendarEventUpdate, user: User | null): Promise<void> {
  const now = new Date().toISOString();
  await updateDoc(doc(db, "events", id), {
    ...update,
    updatedAt: now,
    updatedBy: user?.uid ?? '',
  });
}

export async function deleteEvent(id: string, user: User | null): Promise<void> {
  const now = new Date().toISOString();
  await updateDoc(doc(db, "events", id), {
    deleted: true,
    deletedAt: now,
    deletedBy: user?.uid ?? '',
  });
}

export async function getWebhookById(id: string): Promise<Webhook> {
  const snapshot = await getDoc(doc(db, "webhooks", id));
  return { id: snapshot.id, ...snapshot.data() } as Webhook;
}