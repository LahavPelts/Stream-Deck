import { MatchData } from '../types/schema';

const STORAGE_KEY = 'frc_scouter_2230_matches';
const SCANS_KEY = 'frc_scouter_2230_scans';

// --- Local Matches (My Forms) ---

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

export const clearAllMatches = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SCANS_KEY); // Also clear scans on full clear? Or keep separate?
    // Based on "Clear Data" requirement usually meaning "Reset Device", we clear everything.
  } catch (error) {
    console.error("Failed to clear matches", error);
  }
};

export const importMatches = (newMatches: MatchData[]) => {
  try {
    const current = getMatches();
    // Create a map to merge by ID, preferring new data
    const matchMap = new Map<string, MatchData>();
    current.forEach(m => matchMap.set(m.id, m));
    newMatches.forEach(m => matchMap.set(m.id, m));
    
    const merged = Array.from(matchMap.values());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch (error) {
    console.error("Failed to import matches", error);
    throw error;
  }
};

// --- Scanned Matches (From QR) ---

export const saveScan = (match: MatchData) => {
  try {
    const existing = getScans();
    // Prevent duplicates by ID
    const index = existing.findIndex((m) => m.id === match.id);
    if (index >= 0) {
      existing[index] = match;
    } else {
      existing.push(match);
    }
    localStorage.setItem(SCANS_KEY, JSON.stringify(existing));
    
    // Also add to global "database" of matches so Dashboard sees it? 
    // Usually Scans are separate lists, but for Dashboard analysis we might want to Import them.
    // For now, we'll keep them in SCANS_KEY as a history log, but also auto-import to main storage
    // so the Dashboard works immediately.
    saveMatch(match); 
    
  } catch (error) {
    console.error("Failed to save scan", error);
  }
};

export const getScans = (): MatchData[] => {
  try {
    const raw = localStorage.getItem(SCANS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("Failed to load scans", error);
    return [];
  }
};