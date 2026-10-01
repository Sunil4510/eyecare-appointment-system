/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

export const setItem = (key: string, value: any): void => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`Error setting item in localStorage: ${error}`);
  }
};

export const getItem = <T>(key: string): T | null => {
  try {
    const serializedValue = localStorage.getItem(key);
    return serializedValue ? JSON.parse(serializedValue) : null;
  } catch (error) {
    console.error(`Error getting item from localStorage: ${error}`);
    return null;
  }
};

export const removeItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item from localStorage: ${error}`);
  }
};

export const clearStorage = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error(`Error clearing localStorage: ${error}`);
  }
};
