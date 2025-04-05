/**
 * Utility functions for managing localStorage operations
 */

// Keys for storing different data types
export const STORAGE_KEYS = {
  USER: 'trello_clone_user',
  BOARDS: 'trello_clone_boards',
  LISTS: 'trello_clone_lists',
  CARDS: 'trello_clone_cards',
  LABELS: 'trello_clone_labels',
};

/**
 * Get data from localStorage
 * @param key - Storage key
 * @param defaultValue - Default value if key doesn't exist
 * @returns Parsed data or default value
 */
export const getItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error);
    return defaultValue;
  }
};

/**
 * Save data to localStorage
 * @param key - Storage key
 * @param value - Data to store
 */
export const setItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error storing ${key} to localStorage:`, error);
  }
};

/**
 * Remove data from localStorage
 * @param key - Storage key to remove
 */
export const removeItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
};

/**
 * Clear all app data from localStorage
 */
export const clearStorage = (): void => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}; 