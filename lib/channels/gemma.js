const got = require("got");
const cheerio = require("cheerio");
const datefns = require("date-fns");
const playwright = require("playwright-chromium");
const feed = require("../feed");
const { parseDate, hmsToSeconds } = require("../helpers/time");

const maxEpisodeSeconds = datefns.milliseconds({ minutes: 30 }) / 1000;

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

const createFeed = async () => {
  const episodesPage = await got(
    "https://www.rtve.es/play/audios/moduloRadio/68092/emisiones/?search=gemma"
  );
  const $ = cheerio.load(episodesPage.body);
  const episodesBlockElements = $("li.elem_");
  const episodes = episodesBlockElements
    .map((_index, element) => {
      const titleElement = $(".maintitle", element);
      const title = titleElement.text();

      const descriptionElement = $(".detalle", element);
      const description = descriptionElement.text();

      const durationElement = $(".duration", element);
      const duration = durationElement.text();

      const dateElement = $(".datemi", element);
      const publicationDate = parseDate(dateElement.text());
      const RfcFormattedDate = datefns.formatRFC7231(publicationDate);

      const urlElement = $(".goto_media", element);
      const mediaUrl = urlElement.attr("href");

      return {
        id: mediaUrl,
        title,
        description,
        duration,
        publicationDate: RfcFormattedDate,
        mediaUrl,
      };
    })
    .toArray()
    .slice(0, 10);
  const episodesWithUrl = [];
  const browser = await playwright.chromium.launch({ headless: true });
  const page = await browser.newPage();
  for (const episode of episodes) {
    await page.goto(episode.mediaUrl);
    await page.waitForSelector("audio", { state: "attached" });
    const url = await (await page.$("audio")).getAttribute("src");
    const encodedUrl = url.replaceAll("&", "&amp;");
    episodesWithUrl.push({ ...episode, url: encodedUrl });
  }
  await page.close();
  await browser.close();

  const onlyShortEpisodes = episodesWithUrl.filter((episode) => {
    const episodeSeconds = hmsToSeconds(episode.duration);
    return episodeSeconds < maxEpisodeSeconds;
  });
  return feed(channel, onlyShortEpisodes);
};

module.exports = createFeed;
