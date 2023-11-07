import { Shift } from "../redux/reducers/shifts";
import { getDurationAsString } from "./time";

export function getShiftLengthLabel(shift: Shift, firstPerson = false): React.ReactNode {
  const duration = new Date().getTime() - new Date(shift.start).getTime();
  const durationStr = getDurationAsString(duration);
  return duration < 60000 ? (
    firstPerson ? 'You clocked in less than a minute ago' : 'This employee clocked in less than a minute ago'
  ) : (
    firstPerson ? `You've been clocked in for ${durationStr}` : `This employee has been clocked in for ${durationStr}`
  );
}