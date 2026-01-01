/* eslint-disable @typescript-eslint/no-explicit-any */

// Simplified lodash.get
export const getByPath = (obj: any, path: string): any => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

// Simplified lodash.set (immutable)
export const setByPath = (obj: any, path: string, value: any): any => {
  const parts = path.split('.');
  const newObj = { ...obj };
  let current = newObj;

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    current[part] = { ...current[part] };
    current = current[part];
  }

  current[parts[parts.length - 1]] = value;
  return newObj;
};

export const calculateTotalPoints = (matchData: any): number => {
  // Placeholder logic based on hypothetical 2025 rules
  // Real logic would be here as per PDF Page 8
  let points = 0;
  // Example calculation
  points += (matchData.auto?.coral?.l4 || 0) * 6;
  points += (matchData.teleop?.coral?.l4 || 0) * 4;
  return points;
};
