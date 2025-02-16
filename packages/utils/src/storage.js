"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = exports.Storage = void 0;
const localforage_1 = __importDefault(require("localforage"));
/**
 * Enhanced storage class
 */
class Storage {
    store;
    defaultExpiry;
    constructor(options = {}) {
        const { namespace = 'noteum', driver = [
            localforage_1.default.INDEXEDDB,
            localforage_1.default.WEBSQL,
            localforage_1.default.LOCALSTORAGE,
        ], expiry, } = options;
        this.store = localforage_1.default.createInstance({
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
    async set(key, value, expiry) {
        const item = {
            data: value,
            meta: {
                timestamp: Date.now(),
                expiry: expiry ?? this.defaultExpiry,
            },
        };
        try {
            await this.store.setItem(key, item);
        }
        catch (error) {
            console.error(`Failed to set item ${key}:`, error);
            throw error;
        }
    }
    /**
     * Get data
     * @param key - Key
     * @returns Stored data, returns null if expired or not exists
     */
    async get(key) {
        try {
            const item = await this.store.getItem(key);
            if (!item)
                return null;
            // Check if expired
            if (item.meta.expiry) {
                const expiryTime = item.meta.timestamp + item.meta.expiry;
                if (Date.now() > expiryTime) {
                    await this.remove(key);
                    return null;
                }
            }
            return item.data;
        }
        catch (error) {
            console.error(`Failed to get item ${key}:`, error);
            return null;
        }
    }
    /**
     * Remove data
     * @param key - Key
     */
    async remove(key) {
        try {
            await this.store.removeItem(key);
        }
        catch (error) {
            console.error(`Failed to remove item ${key}:`, error);
            throw error;
        }
    }
    /**
     * Clear all data
     */
    async clear() {
        try {
            await this.store.clear();
        }
        catch (error) {
            console.error('Failed to clear storage:', error);
            throw error;
        }
    }
    /**
     * Get all keys
     */
    async keys() {
        try {
            return await this.store.keys();
        }
        catch (error) {
            console.error('Failed to get keys:', error);
            return [];
        }
    }
    /**
     * Set multiple items
     * @param items - Key-value pairs object
     * @param expiry - Expiration time (in milliseconds)
     */
    async setMany(items, expiry) {
        try {
            await Promise.all(Object.entries(items).map(([key, value]) => this.set(key, value, expiry)));
        }
        catch (error) {
            console.error('Failed to set multiple items:', error);
            throw error;
        }
    }
    /**
     * Get multiple items
     * @param keys - Array of keys
     * @returns Key-value pairs object
     */
    async getMany(keys) {
        try {
            const results = await Promise.all(keys.map(async (key) => ({
                key,
                value: await this.get(key),
            })));
            return results.reduce((acc, { key, value }) => ({
                ...acc,
                [key]: value,
            }), {});
        }
        catch (error) {
            console.error('Failed to get multiple items:', error);
            return {};
        }
    }
    /**
     * Check if key exists
     * @param key - Key
     */
    async has(key) {
        try {
            const value = await this.get(key);
            return value !== null;
        }
        catch {
            return false;
        }
    }
    /**
     * Get number of stored items
     */
    async size() {
        try {
            const keys = await this.keys();
            return keys.length;
        }
        catch {
            return 0;
        }
    }
}
exports.Storage = Storage;
// Create default instance
exports.storage = new Storage();
//# sourceMappingURL=storage.js.map