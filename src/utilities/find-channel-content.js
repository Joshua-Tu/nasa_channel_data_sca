const formatDateTime = require('./format-iso-date-to-AEST');

function findFirstEpisodes(rssFeedData) {
  const { title: { _text: title } , item: items, description: { _text: description } } = rssFeedData;

  const firstTenItems = items.filter((_item, idx) => idx <= 9);

  const episodes = firstTenItems.map(item => {
    return {
      title: item.title._text,
      audioUrl: item.enclosure._attributes.url,
      publishedDate: item.pubDate._text
    }
  });

  return {
    title,
    description,
    episodes
  };
}

function findEdtEpisodes(dataWithEDT) {
  const backupDataWithEDT = Object.assign({}, dataWithEDT);

  return {
    ...backupDataWithEDT,
    episodes: backupDataWithEDT.episodes.map(episode => {
      return {
        ...episode,
        publishedDate: formatDateTime.convertISODateToAEST(episode.publishedDate)
      }
    })
  }
}

module.exports = {
  findFirstEpisodes,
  findEdtEpisodes
}