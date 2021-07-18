const redis = require('redis');

class CacheService {
  #client
  #KEY_PREFIX

  constructor(keyPrefix) {
    this.#client = redis.createClient();
    this.#KEY_PREFIX = keyPrefix;
  }

  async set(key, value, ttlSeconds = 10) {
    return new Promise((resolve, reject) => {
      this.#client.set(`${this.#KEY_PREFIX}:${key}`, value, 'EX', ttlSeconds, (error, result) => {
        if (error) return reject(error);

        return resolve(result);
      })
    })
  }

  async get(key) {
    return new Promise((resolve, reject) => {
      this.#client.get(`${this.#KEY_PREFIX}:${key}`, (error, result) => {
        if (error) return reject(error);

        return resolve(result);
      })
    })
  }

  async getOrSetCache(callback, key, ttlSeconds = 10) {
    return new Promise((resolve, reject) => {
      const fullKey = `${this.#KEY_PREFIX}:${key}`;

      this.#client.get(fullKey, async (error, result) => {
        if (error) return reject(error);
        if (result != null) return resolve(JSON.parse(result));

        const freshResult = await callback();
        this.#client.setex(fullKey, ttlSeconds, JSON.stringify(freshResult), (error, _reply) => {
          if (error) return reject(error);

          return resolve(freshResult);
        })
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