const feed = (channel, episodes) => `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" version="2.0">
<channel>
  <title><![CDATA[${channel.title}]]></title>
  <link>${channel.link}</link>
  <language>es-es</language>
  <itunes:subtitle><![CDATA[${channel.subtitle}]]></itunes:subtitle>
  <itunes:author><![CDATA[${channel.audio}]]></itunes:author>
  <itunes:summary><![CDATA[${channel.summary}]]></itunes:summary>
  <description><![CDATA[${channel.description}]]></description>
  <image>
    <url>${channel.imageUrl}</url>
    <title>
    <![CDATA[${channel.imageTitle || channel.title}]]>
    </title>
    <link>${channel.imageLink || channel.link}</link>
  </image>
  <itunes:explicit>no</itunes:explicit>
  <itunes:image href="${channel.imageUrl}"/>
  ${episodes.map(
    (episode) => `<item>
      <title><![CDATA[${episode.title}]]></title>
      <itunes:summary><![CDATA[${episode.title}]]></itunes:summary>
      <description><![CDATA[${episode.description}]]></description>
      <link>${episode.url}></link>
      <enclosure url="${
        episode.url
      }" type="audio/mp4" length="1024"></enclosure>
      <pubDate>${episode.publicationDate}</pubDate>
      <itunes:author><![CDATA[${
        episode.author || channel.author
      }]]></itunes:author>
      <itunes:duration><![CDATA[${episode.duration}]]></itunes:duration>
      <itunes:explicit>no</itunes:explicit>
      <guid>${episode.id}</guid>
  </item>`
  )}
</channel>
</rss>`;

module.exports = feed;
