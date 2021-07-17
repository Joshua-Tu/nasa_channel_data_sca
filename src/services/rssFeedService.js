const axios = require('axios');

class RssFeedService {
  #axiosInstance
  
  constructor() {
    this.#axiosInstance = axios.create({
      baseURL: 'https://www.nasa.gov/rss/dyn/',
      timeout: 10 * 1000
    })
  }

  async getData(channelName) {
    try {
      const result = await this.#axiosInstance.get(channelName);
      return result.data;
    } catch (error) {
      throw { errorName: 'Failed to get RSS feed data', errorDetails: error};
    }
  }
}