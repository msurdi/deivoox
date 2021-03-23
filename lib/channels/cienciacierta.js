const got = require("got");
const cheerio = require("cheerio");
const datefns = require("date-fns");
const feed = require("../feed");

const channel = {
  title: "A ciencia cierta",
  subtitle: "A ciencia cierta",
  author: "CV Radio",
  summary: "Podcast a ciencia cierta",
  description:
    "Programa de ciencia dirigido y presentado por Antonio Rivera que se emite todas las semanas en CV Radio.",
  imageUrl:
    "https://static-1.ivoox.com/canales/0/6/8/0/4871603780860_XXL.jpg?ts=1603780933",
  link: "https://www.ivoox.com/podcast-a-ciencia-cierta_sq_f1286369_1.html",
};

const createFeed = async () => {
  const episodesPage = await got(
    "https://www.ivoox.com/podcast-podcast-podcast-podcast-podcast-podcast-podcast-podcast-podcast-podcast-podcast-podcast-podcast-a-ciencia-cierta_sq_f1286369_1.html"
  );
  const $ = cheerio.load(episodesPage.body);
  const episodesBlockElements = $(".modulo-type-episodio");
  const episodes = episodesBlockElements
    .map((_index, element) => {
      const titleElement = $(".title-wrapper", element);
      const title = titleElement.text();

      const descriptionElement = $(".audio-description button", element);
      const description = descriptionElement.attr("data-content");

      const durationElement = $(".time", element);
      const duration = durationElement.text();

      const publicationDate = datefns.parse(
        title.match(/(\d+)\/(\d+)\/(\d+)/)[0],
        "d/M/yyyy",
        new Date(0)
      );

      const RfcFormattedDate = datefns.formatRFC7231(publicationDate);

      const id = $("a", titleElement)
        .attr("href")
        .match(/_rf_(\d+)_1.html/)[1];

      return {
        id,
        title,
        description,
        duration,
        publicationDate: RfcFormattedDate,
        url: `https://www.ivoox.com/listenembeded_mn_${id}_1.m4a?source=EMBEDEDHTML5`,
      };
    })
    .toArray();
  return feed(channel, episodes);
};

module.exports = createFeed;
