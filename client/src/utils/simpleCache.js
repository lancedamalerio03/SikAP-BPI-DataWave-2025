// Simple in-memory cache utility
class SimpleCache {
  constructor() {
    this.cache = new Map();
    this.timestamps = new Map();
  }

  set(key, value, ttlMs = 300000) { // Default 5 minutes TTL
    this.cache.set(key, value);
    this.timestamps.set(key, Date.now() + ttlMs);
  }

  get(key) {
    const timestamp = this.timestamps.get(key);
    if (!timestamp || Date.now() > timestamp) {
      this.delete(key);
      return null;
    }
    return this.cache.get(key);
  }

  delete(key) {
    this.cache.delete(key);
    this.timestamps.delete(key);
  }

  clear() {
    this.cache.clear();
    this.timestamps.clear();
  }

  size() {
    return this.cache.size;
  }
}

// Create a singleton instance
const simpleCache = new SimpleCache();

// Cache keys
export const CACHE_KEYS = {
  USER_PROFILE: (userId) => `user_profile_${userId}`,
  USER_LOANS: (userId) => `user_loans_${userId}`,
  LOCATIONS: 'locations_all'
};

// Cache TTL (in milliseconds)
export const CACHE_TTL = {
  USER_PROFILE: 600000, // 10 minutes
  USER_LOANS: 180000,   // 3 minutes
  LOCATIONS: 300000     // 5 minutes
};

export default simpleCache;
