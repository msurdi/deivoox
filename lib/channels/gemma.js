const got = require("got");
const cheerio = require("cheerio");
const datefns = require("date-fns");
const feed = require("../feed");

const channel = {
  title: "Gente Despierta - Gemma Del Caño",
  subtitle: "Gente Despierta",
  author: "Gente Despierta",
  summary: "Podcast gente despierta filtrado por episodios de Gemma Del Caño",
  description:
    "Podcast gente despierta filtrado por episodios de Gemma Del Caño",
  imageUrl: "https://img2.rtve.es/p/68092",
  link: "https://www.rtve.es/alacarta/audios/gente-despierta/",
};

const monthsInEnglish = (dateString) =>
  dateString
    .replace("ene", "Jan")
    .replace("abr", "Apr")
    .replace("ago", "Aug")
    .replace("dic", "Dec");

const createFeed = async () => {
  const episodesPage = await got(
    " https://www.rtve.es/alacarta/interno/contenttable.shtml?ctx=68092&pageSize=15&order=&orderCriteria=DESC&locale=es&mode=&module=&advSearchOpen=true&titleFilter=gemma&monthFilter=&yearFilter=&typeFilter=39978"
  );
  const $ = cheerio.load(episodesPage.body);
  const episodesBlockElements = $(".ContentTabla > ul > li:not(:first-child)");
  const episodes = episodesBlockElements
    .map((_index, element) => {
      const titleElement = $(".col_tit > a", element);
      const title = titleElement.text();

      const descriptionElement = $(".detalle", element);
      const description = descriptionElement.text();

      const durationElement = $(".col_dur", element);
      const duration = durationElement.text();

      const dateElement = $(".col_fec", element);
      const publicationDate = datefns.parse(
        monthsInEnglish(dateElement.text()),
        "dd MMM yyyy",
        new Date(0)
      );
      const RfcFormattedDate = datefns.formatRFC7231(publicationDate);

      const urlElement = $(".col_tip > a", element);
      const url = urlElement.attr("href");

      const id = titleElement.attr("href");

      return {
        id,
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

module.exports = createFeed;
