import { Shift } from "../reducers/shifts";
import { RootState } from "../store";

export function getCurrentShift(state: RootState): Shift | undefined {
  return state.shifts.shifts.find(shift => !shift.end);
}

export function getPreviousShifts(state: RootState): Shift[] {
  return state.shifts.shifts
    .filter(shift => shift.end)
    .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());
}

export function getLongestShifts(state: RootState): Shift[] {
  return state.shifts.shifts
    .filter(shift => shift.end)
    .sort((a, b) => {
      const aDuration = new Date(a.end).getTime() - new Date(a.start).getTime();
      const bDuration = new Date(b.end).getTime() - new Date(b.start).getTime();
      return bDuration - aDuration;
    })
    .slice(0, 10);
}

export function getShiftsForLastWeek(state: RootState): Shift[] {
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  return state.shifts.shifts.filter(shift => shift.end && new Date(shift.start) > lastWeek);
}

export function getLifetimeHoursWorked(state: RootState): number {
  const time = state.shifts.shifts.reduce((total, shift) => {
    if (shift.end) {
      return total + (new Date(shift.end).getTime() - new Date(shift.start).getTime());
    }
    return total;
  }, 0);
  return Math.round(time / 1000 / 60 / 60);
}