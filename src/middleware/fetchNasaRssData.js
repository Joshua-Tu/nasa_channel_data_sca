const nasaRssFeed = require('../services/nasaRssService');
const cacheService = require('../services/cacheService');
const convertXml2Json = require('xml-js');

const fetchNasaRssData = async (_req, res, next) => {
  const channelName = 'Houston-We-Have-a-Podcast';
  const nacaCacheService = new cacheService('NASA_RSS_CHANNEL');

  const nasaChannelData = await nacaCacheService.getOrSetCache(async () => {
    return await nasaRssFeed.getData(channelName);
  }, channelName);

  const { rss: { channel } } = convertXml2Json.xml2js(nasaChannelData, { compact: true, spaces: 4 });

  res.locals.nasaRssFeed = channel;
  next()
};

module.exports = fetchNasaRssData;