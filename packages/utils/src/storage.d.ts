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
export declare class Storage {
    private store;
    private defaultExpiry?;
    constructor(options?: StorageOptions);
    /**
     * Set data
     * @param key - Key
     * @param value - Value
     * @param expiry - Expiration time (in milliseconds)
     */
    set<T>(key: string, value: T, expiry?: number): Promise<void>;
    /**
     * Get data
     * @param key - Key
     * @returns Stored data, returns null if expired or not exists
     */
    get<T>(key: string): Promise<T | null>;
    /**
     * Remove data
     * @param key - Key
     */
    remove(key: string): Promise<void>;
    /**
     * Clear all data
     */
    clear(): Promise<void>;
    /**
     * Get all keys
     */
    keys(): Promise<string[]>;
    /**
     * Set multiple items
     * @param items - Key-value pairs object
     * @param expiry - Expiration time (in milliseconds)
     */
    setMany(items: Record<string, any>, expiry?: number): Promise<void>;
    /**
     * Get multiple items
     * @param keys - Array of keys
     * @returns Key-value pairs object
     */
    getMany<T>(keys: string[]): Promise<Record<string, T | null>>;
    /**
     * Check if key exists
     * @param key - Key
     */
    has(key: string): Promise<boolean>;
    /**
     * Get number of stored items
     */
    size(): Promise<number>;
}
export declare const storage: Storage;
export {};
//# sourceMappingURL=storage.d.ts.map