/**
 * localStorage 封装
 */
export const storage = {
  get(key: string) {
    const value = localStorage.getItem(key);
    try {
      return value ? JSON.parse(value) : null;
    } catch {
      return value;
    }
  },
  
  set(key: string, value: any) {
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  },
  
  remove(key: string) {
    localStorage.removeItem(key);
  },
  
  clear() {
    localStorage.clear();
  },
};
