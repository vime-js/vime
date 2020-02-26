const getHours = value => Math.trunc((value / 60 / 60) % 60);
const getMinutes = value => Math.trunc((value / 60) % 60);
const getSeconds = value => Math.trunc(value % 60);

export const formatTime = (seconds = 0, alwaysShowHours = false) => {
  // Format time component to add leading zero
  const format = value => `0${value}`.slice(-2);

  let hours = getHours(seconds);
  const mins = getMinutes(seconds);
  const secs = getSeconds(seconds);

  if (alwaysShowHours || hours > 0) {
    hours = `${hours}:`;
  } else {
    hours = '';
  }

  return `${hours}${format(mins)}:${format(secs)}`;
};
