const formatDateTime = require('./format-iso-date-to-AEST');

function findFirstNEpisodes(rssFeedData, episodeAmount = 10) {
  try {
    const { title: { _text: title } , item: items, description: { _text: description } } = rssFeedData;

    const firstTenItems = items.filter((_item, idx) => idx <= episodeAmount - 1);
  
    const episodes = firstTenItems.map(item => {
      return {
        title: item.title._text,
        audioUrl: item.enclosure?._attributes.url,
        publishedDate: item.pubDate?._text
      }
    });
  
    return {
      title,
      description,
      episodes
    };
  } catch (error) {
    console.log('Error:', error.message)
    throw new Error({ errorDetails: error.message, errorIdentifier: `Failed to find first ${episodeAmount} episodes` });
  }
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

function findOrderedEpisodes(dataWithEDT, order) {
  let backupEpisodes = dataWithEDT.episodes.slice();

  if (order == 'asc') {
    backupEpisodes = backupEpisodes.sort((episodeA, episodeB) => new Date(episodeA.publishedDate) - new Date(episodeB.publishedDate));
  };

  if (order == 'dsc') {
    backupEpisodes = backupEpisodes.sort((episodeA, episodeB) => new Date(episodeB.publishedDate) - new Date(episodeA.publishedDate));
  };

  return {
    ...dataWithEDT,
    episodes: backupEpisodes
  }
}

module.exports = {
  findFirstNEpisodes: findFirstNEpisodes,
  findEdtEpisodes,
  findOrderedEpisodes
}