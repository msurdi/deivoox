// eslint-disable-next-line import/prefer-default-export
export const hmsToSeconds = (hmsString) => {
  const parts = hmsString.split(":");
  let seconds = 0;

  let minutes = 1;

  while (parts.length > 0) {
    seconds += minutes * parseInt(parts.pop(), 10);
    minutes *= 60;
  }

  return seconds;
};
