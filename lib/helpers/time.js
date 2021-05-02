const datefns = require("date-fns");

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

export const monthsInEnglish = (dateString) =>
  dateString
    .replace("ene", "Jan")
    .replace("abr", "Apr")
    .replace("ago", "Aug")
    .replace("dic", "Dec");

export const parseDate = (dateString) => {
  const parsedDate = datefns.parse(
    monthsInEnglish(dateString),
    "dd MMM yyyy",
    new Date(0)
  );

  if (!Number.isNaN(parsedDate.valueOf())) {
    return parsedDate;
  }
  return new Date();
};
