const datefns = require("date-fns");

/**
 * Convert Ivoox custom date formats (such as "07:00 - 16 de oct. de 2022") to Date objects.
 * @param {*} text A string with a date in Ivoox custom format.
 * @returns {Date} A Date object.
 */
const parseDate = (text) => {
  const date = datefns.parse(
    text,
    "HH:mm '-' dd 'de' MMM. 'de' yyyy",
    new Date()
  );
  return date;
};

module.exports = { parseDate };
