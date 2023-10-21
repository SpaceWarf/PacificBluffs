export function getDurationAsString(duration: number): string {
  const hours = Math.floor(duration / 1000 / 60 / 60);
  const minutes = Math.floor((duration / 1000 / 60 / 60 - hours) * 60);
  
  if (hours === 0 && minutes === 0) {
    return 'less than a minute';
  }
  return `${getHourLabel(hours)} ${getMinutesLabel(minutes)}`;
}

function getHourLabel(hours: number): string {
  if (hours === 0) {
    return '';
  } else if (hours === 1) {
    return '1 hour';
  }
  return `${hours} hours`;
}

function getMinutesLabel(minutes: number): string {
  if (minutes === 0) {
    return '';
  } else if (minutes === 1) {
    return '1 minute';
  }
  return `${minutes} minutes`;
}