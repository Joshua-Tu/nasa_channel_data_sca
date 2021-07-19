require('dotenv').config();
const redis = require('redis');

class CacheService {
  #client
  #KEY_PREFIX

  constructor(keyPrefix) {
    this.#client = redis.createClient();
    this.#KEY_PREFIX = keyPrefix;
  }

  async set(key, value, ttlSeconds = +process.env.REQUEST_CACHE_TTL) {
    const fullKey = `${this.#KEY_PREFIX}:${key}`;

    return new Promise((resolve, _reject) => {
      this.#client.set(fullKey, value, 'EX', ttlSeconds, (error, result) => {
        if (error) {
          console.log({ errorName: `Cache error for key ${fullKey}` , errorDetails: error });
          return null
        };

        return resolve(result);
      })
    })
  }

  async get(key) {
    return new Promise((resolve, _reject) => {
      const fullKey = `${this.#KEY_PREFIX}:${key}`;

      this.#client.get(fullKey, (error, result) => {
        if (error) {
          console.log({ errorName: `Cache error for key ${fullKey}` , errorDetails: error });
          return null
        };

        return resolve(result);
      })
    })
  }

  async getOrSetCache(callback, key, ttlSeconds = 10) {
    return new Promise((resolve, _reject) => {
      const fullKey = `${this.#KEY_PREFIX}:${key}`;
      let freshResult;

      this.#client.get(fullKey, async (error, result) => {
        if (error) console.log({ errorName: `Cache error for key ${fullKey}` , errorDetails: error });
        if (result != null) return resolve(JSON.parse(result));

        freshResult = await callback();

        this.#client.setex(fullKey, ttlSeconds, JSON.stringify(freshResult), (error, _reply) => {
          if (error) console.log({ errorName: `Cache error for key ${freshResult}`, errorDetails: error });

          return resolve(freshResult);
        });

        return resolve(freshResult);
      })
    });
  }

  async delete(key) {
    return new Promise((resolve, _reject) => {
      this.#client.del(`${this.#KEY_PREFIX}:${key}`, () => {
        resolve();
      })
    })
  }
}

module.exports = CacheService;