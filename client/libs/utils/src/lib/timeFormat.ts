/**
 * A clock reading: always m:ss, so "0:15" can't be mistaken for 15 reps or
 * 15 kg; h:mm:ss past an hour. Negative times (an overrun rest) get a minus.
 */
export function timeFormat(seconds: number): string {
  if (seconds < 0) {
    return `-${timeFormat(Math.abs(seconds))}`;
  }

  const whole = Math.floor(seconds);
  const pad = (val: number): string => `${val % 60}`.padStart(2, "0");
  const minutes = Math.floor(whole / 60);

  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    return `${hours}:${pad(minutes)}:${pad(whole)}`;
  }

  return `${minutes}:${pad(whole)}`;
}
