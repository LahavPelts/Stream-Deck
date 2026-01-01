import { MatchData } from '../types/schema';

const STORAGE_KEY = 'frc_scouter_2230_matches';

export const saveMatch = (match: MatchData) => {
  try {
    const existing = getMatches();
    // Update if exists (by ID), otherwise append
    const index = existing.findIndex((m) => m.id === match.id);
    if (index >= 0) {
      existing[index] = match;
    } else {
      existing.push(match);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch (error) {
    console.error("Failed to save match", error);
  }
};

export const getMatches = (): MatchData[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("Failed to load matches", error);
    return [];
  }
};

export const getMatchById = (id: string): MatchData | undefined => {
  const matches = getMatches();
  return matches.find((m) => m.id === id);
};