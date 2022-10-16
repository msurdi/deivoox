const got = require("got");
const cheerio = require("cheerio");
const datefns = require("date-fns");
const feed = require("../feed");

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

/**
 * Create a feed for a given Ivoox channel.
 * Examples of valid channel urls:
 * - https://www.ivoox.com/en/podcast-abrazo-del-oso-podcast_sq_f13737_1.html
 * - https://www.ivoox.com/en/podcast-a-ciencia-cierta_sq_f1286369_1.html
 * @param {*} channelUrl The channel url.
 * @returns An XML string with the feed data.
 */
const createIvooxFeed = async (channelUrl) => {
  const episodesPage = await got(channelUrl, {
    headers: { "Accept-Language": "en" },
  });
  const $ = cheerio.load(episodesPage.body);

  // Extract channel details
  const channel = {
    title: $("meta[property='og:title']").attr("content"),
    subtitle: $("meta[property='og:description']").attr("content"),
    author: $("meta[property='og:site_name']").attr("content"),
    summary: $("meta[property='og:description']").attr("content"),
    description: $("meta[property='og:description']").attr("content"),
    imageUrl: $("meta[property='og:image']").attr("content"),
    link: $("meta[property='og:url']").attr("content"),
  };

  // Extract episodes details
  const episodesBlockElements = $(".modulo-type-episodio");
  const episodes = episodesBlockElements
    .map((_index, element) => {
      const titleElement = $(".title-wrapper", element);
      const title = titleElement.text();

      const descriptionElement = $(".audio-description button", element);
      const description = descriptionElement.attr("data-content");

      const durationElement = $(".time", element);
      const duration = durationElement.text();

      const publicationDateElement = $(".date", element);
      const publicationDate = parseDate(publicationDateElement.attr("title"));

      const RfcFormattedDate = datefns.formatRFC7231(publicationDate);

      const id = $("a", titleElement)
        .attr("href")
        .match(/_rf_(\d+)_1.html/)[1];

      const url = `https://www.ivoox.com/listenembeded_mn_${id}_1.m4a?source=EMBEDEDHTML5`;

      return {
        id: url,
        title,
        description,
        duration,
        publicationDate: RfcFormattedDate,
        url,
      };
    })
    .toArray();
  return feed(channel, episodes);
};

module.exports = createIvooxFeed;
