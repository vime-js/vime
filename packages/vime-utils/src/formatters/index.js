const get_hours = (value) => Math.trunc((value / 60 / 60) % 60);
const get_minutes = (value) => Math.trunc((value / 60) % 60);
const get_seconds = (value) => Math.trunc(value % 60);

export const format_time = (seconds = 0, alwaysShowHours = false) => {
  // Format time component to add leading zero
  const format = (value) => `0${value}`.slice(-2);

  let hours = get_hours(seconds);
  const mins = get_minutes(seconds);
  const secs = get_seconds(seconds);

  if (alwaysShowHours || hours > 0) {
    hours = `${hours}:`;
  } else {
    hours = '';
  }

  return `${hours}${format(mins)}:${format(secs)}`;
};
