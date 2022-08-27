const datefns = require("date-fns");

const hmsToSeconds = (hmsString) => {
  const parts = hmsString.split(":");
  let seconds = 0;

  let minutes = 1;

  while (parts.length > 0) {
    seconds += minutes * parseInt(parts.pop(), 10);
    minutes *= 60;
  }

  return seconds;
};

const parseDate = (dateString) => {
  const parsedDate = datefns.parse(
    dateString.trim(),
    "dd/MM/yyyy",
    new Date(0)
  );

  if (!Number.isNaN(parsedDate.valueOf())) {
    return parsedDate;
  }
  return new Date();
};

module.exports = { hmsToSeconds, parseDate };
