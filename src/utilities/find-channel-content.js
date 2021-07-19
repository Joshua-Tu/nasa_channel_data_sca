const formatDateTime = require('./format-iso-date-to-AEST');

function findFirstEpisodes(rssFeedData) {
  try {
    const { title: { _text: title } , item: items, description: { _text: description } } = rssFeedData;

    const firstTenItems = items.filter((_item, idx) => idx <= 9);
  
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
    throw new Error({ errorDetails: error.message, errorIdentifier: 'Failed to find first 10 episodes' })
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


module.exports = {
  findFirstEpisodes,
  findEdtEpisodes
}