const got = require("got");
const cheerio = require("cheerio");
const datefns = require("date-fns");

const feedXML = (episodes) => `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" version="2.0">
<channel>
  <title>A ciencia cierta</title>
  <link>https://www.ivoox.com/podcast-a-ciencia-cierta_sq_f1286369_1.html</link>
  <language>es-es</language>
  <itunes:subtitle>A ciencia cierta</itunes:subtitle>
  <itunes:author>CV Radio</itunes:author>
  <itunes:summary>Podcast a ciencia cierta</itunes:summary>
  <description><![CDATA[ Programa de ciencia dirigido y presentado por Antonio Rivera que se emite todas las semanas en CV Radio. ]]></description>
  <image>
    <url>https://static-1.ivoox.com/canales/0/6/8/0/4871603780860_XXL.jpg?ts=1603780933</url>
    <title>
    <![CDATA[ A Ciencia Cierta ]]>
    </title>
    <link>https://www.ivoox.com/podcast-a-ciencia-cierta_sq_f1286369_1.html</link>
  </image>
  <itunes:explicit>no</itunes:explicit>
  <itunes:image href="https://static-1.ivoox.com/canales/0/6/8/0/4871603780860_XXL.jpg?ts=1603780933"/>
  ${episodes.map(
    (episode) => `<item>
      <title>${episode.title}</title>
      <itunes:summary>${episode.title}</itunes:summary>
      <description>${episode.description}</description>
      <link>${episode.url}</link>
      <enclosure url="${episode.url}" type="audio/mp4" length="1024"></enclosure>
      <pubDate>${episode.publicationDate}</pubDate>
      <itunes:author>CVRadio</itunes:author>
      <itunes:duration>${episode.duration}</itunes:duration>
      <itunes:explicit>no</itunes:explicit>
      <guid>${episode.url}</guid>
  </item>`
  )}
</channel>
</rss>`;

const main = async () => {
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
  return feedXML(episodes);
};

module.exports = main;
