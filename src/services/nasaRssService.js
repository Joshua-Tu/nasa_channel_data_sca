const axios = require('axios');

class NasaRssService {
  #axiosInstance
  
  constructor() {
    this.#axiosInstance = axios.create({
      baseURL: 'https://www.nasa.gov/rss/dyn/',
      timeout: 10 * 1000
    })
  }

  async getData(channelName) {
    try {
      const result = await this.#axiosInstance.get(channelName + '.rss');
      return result.data;
    } catch (error) {
      throw { errorName: 'Failed to get RSS feed data', errorDetails: error};
    }
  }
}

let instance;

const getInstance = () => {
  if (!instance) {
    instance = new NasaRssService()
  }

  return instance;
}

module.exports = getInstance();
