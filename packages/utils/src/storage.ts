import localforage from 'localforage';

/**
 * Interface for storage item metadata
 */
interface StorageItemMeta {
  timestamp: number;
  expiry?: number;
}

/**
 * Complete data structure for storage item
 */
interface StorageItem<T> {
  data: T;
  meta: StorageItemMeta;
}

/**
 * Storage configuration options
 */
interface StorageOptions {
  /** Storage namespace */
  namespace?: string;
  /** Storage driver priority */
  driver?: string[];
  /** Data expiration time (in milliseconds) */
  expiry?: number;
}

/**
 * Enhanced storage class
 */
export class Storage {
  private store: LocalForage;
  private defaultExpiry?: number;

  constructor(options: StorageOptions = {}) {
    const {
      namespace = 'noteum',
      driver = [
        localforage.INDEXEDDB,
        localforage.WEBSQL,
        localforage.LOCALSTORAGE,
      ],
      expiry,
    } = options;

    this.store = localforage.createInstance({
      name: namespace,
      driver,
    });

    this.defaultExpiry = expiry;
  }

  /**
   * Set data
   * @param key - Key
   * @param value - Value
   * @param expiry - Expiration time (in milliseconds)
   */
  async set<T>(key: string, value: T, expiry?: number): Promise<void> {
    const item: StorageItem<T> = {
      data: value,
      meta: {
        timestamp: Date.now(),
        expiry: expiry ?? this.defaultExpiry,
      },
    };

    try {
      await this.store.setItem(key, item);
    } catch (error) {
      console.error(`Failed to set item ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get data
   * @param key - Key
   * @returns Stored data, returns null if expired or not exists
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const item: StorageItem<T> | null = await this.store.getItem(key);
      
      if (!item) return null;

      // Check if expired
      if (item.meta.expiry) {
        const expiryTime = item.meta.timestamp + item.meta.expiry;
        if (Date.now() > expiryTime) {
          await this.remove(key);
          return null;
        }
      }

      return item.data;
    } catch (error) {
      console.error(`Failed to get item ${key}:`, error);
      return null;
    }
  }

  /**
   * Remove data
   * @param key - Key
   */
  async remove(key: string): Promise<void> {
    try {
      await this.store.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove item ${key}:`, error);
      throw error;
    }
  }

  /**
   * Clear all data
   */
  async clear(): Promise<void> {
    try {
      await this.store.clear();
    } catch (error) {
      console.error('Failed to clear storage:', error);
      throw error;
    }
  }

  /**
   * Get all keys
   */
  async keys(): Promise<string[]> {
    try {
      return await this.store.keys();
    } catch (error) {
      console.error('Failed to get keys:', error);
      return [];
    }
  }

  /**
   * Set multiple items
   * @param items - Key-value pairs object
   * @param expiry - Expiration time (in milliseconds)
   */
  async setMany(items: Record<string, any>, expiry?: number): Promise<void> {
    try {
      await Promise.all(
        Object.entries(items).map(([key, value]) => 
          this.set(key, value, expiry)
        )
      );
    } catch (error) {
      console.error('Failed to set multiple items:', error);
      throw error;
    }
  }

  /**
   * Get multiple items
   * @param keys - Array of keys
   * @returns Key-value pairs object
   */
  async getMany<T>(keys: string[]): Promise<Record<string, T | null>> {
    try {
      const results = await Promise.all(
        keys.map(async (key) => ({
          key,
          value: await this.get<T>(key),
        }))
      );

      return results.reduce((acc, { key, value }) => ({
        ...acc,
        [key]: value,
      }), {});
    } catch (error) {
      console.error('Failed to get multiple items:', error);
      return {};
    }
  }

  /**
   * Check if key exists
   * @param key - Key
   */
  async has(key: string): Promise<boolean> {
    try {
      const value = await this.get(key);
      return value !== null;
    } catch {
      return false;
    }
  }

  /**
   * Get number of stored items
   */
  async size(): Promise<number> {
    try {
      const keys = await this.keys();
      return keys.length;
    } catch {
      return 0;
    }
  }
}

// Create default instance
export const storage = new Storage();
