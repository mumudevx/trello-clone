/**
 * Helper functions for the Trello clone application
 */

/**
 * Generate a unique ID
 * @returns A unique string ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

/**
 * Format a date from timestamp
 * @param timestamp - Timestamp in milliseconds
 * @returns Formatted date string
 */
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format a time from timestamp
 * @param timestamp - Timestamp in milliseconds 
 * @returns Formatted time string
 */
export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Create a new timestamp for the current time
 * @returns Current timestamp in milliseconds
 */
export const getCurrentTimestamp = (): number => {
  return Date.now();
};

/**
 * Reorder items in an array based on drag and drop result
 */
export function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

/**
 * Sort items by their position property
 * @param items - Array of items with position property
 * @returns Sorted array
 */
export const sortByPosition = <T extends { position: number }>(items: T[]): T[] => {
  return [...items].sort((a, b) => a.position - b.position);
}; 