require('dotenv').config();
const nasaRssFeed = require('../services/nasaRssService');
const cacheService = require('../services/cacheService');
const convertXml2Json = require('xml-js');

const fetchNasaRssData = async (_req, res, next) => {
  try {
    const channelName = 'Houston-We-Have-a-Podcast';
    const nacaCacheService = new cacheService(process.env.NASA_RSS_CHANNEL_CACHE_PREFIX);
  
    const nasaChannelData = await nacaCacheService.getOrSetCache(async () => {
      return await nasaRssFeed.getData(channelName);
    }, channelName, +process.env.NASA_DATA_CACHE_TTL);
  
    const { rss: { channel } } = convertXml2Json.xml2js(nasaChannelData, { compact: true, spaces: 4 });
  
    res.locals.nasaRssFeed = channel;
    next()
  } catch (error) {
    res.status(500).send('Internal server error');
  }
};

module.exports = fetchNasaRssData;