export type SectionType = 'Match' | 'Auto' | 'Teleop' | 'Endgame';

export interface FieldConfig {
  id: string;
  section: SectionType;
  label: string;
  type: 'number' | 'boolean' | 'text' | 'select' | 'position'; // Added 'position' for the field image selector
  path: string;
  options?: string[];
  min?: number;
  max?: number;
}

export const GAME_CONFIG: FieldConfig[] = [
  // --- MATCH INFO ---
  { id: 'm1', section: 'Match', label: 'Match Type', type: 'select', path: 'match.type', options: ['Q', 'P', 'E', 'F'] },
  { id: 'm2', section: 'Match', label: 'Match Number', type: 'number', path: 'match.number' },
  { id: 'm3', section: 'Match', label: 'Team Number', type: 'number', path: 'match.teamNumber' },
  { id: 'm4', section: 'Match', label: 'Alliance', type: 'select', path: 'match.alliance', options: ['R', 'B'] },
  { id: 'm5', section: 'Match', label: 'Starting Position', type: 'position', path: 'match.startingPosition' },

  // --- AUTONOMOUS ---
  { id: 'a1', section: 'Auto', label: 'Crossed Line', type: 'boolean', path: 'auto.crossedLine' },
  // Auto Coral
  { id: 'a2', section: 'Auto', label: 'Auto Coral L4', type: 'number', path: 'auto.coral.l4' },
  { id: 'a3', section: 'Auto', label: 'Auto Coral L3', type: 'number', path: 'auto.coral.l3' },
  { id: 'a4', section: 'Auto', label: 'Auto Coral L2', type: 'number', path: 'auto.coral.l2' },
  { id: 'a5', section: 'Auto', label: 'Auto Coral L1', type: 'number', path: 'auto.coral.l1' },
  // Auto Algae
  { id: 'a8', section: 'Auto', label: 'Auto Processor', type: 'number', path: 'auto.algae.processor' },
  { id: 'a9', section: 'Auto', label: 'Auto Net', type: 'number', path: 'auto.algae.net' },

  // --- TELEOP ---
  // Teleop Coral
  { id: 't1', section: 'Teleop', label: 'Teleop Coral L4', type: 'number', path: 'teleop.coral.l4' },
  { id: 't2', section: 'Teleop', label: 'Teleop Coral L3', type: 'number', path: 'teleop.coral.l3' },
  { id: 't3', section: 'Teleop', label: 'Teleop Coral L2', type: 'number', path: 'teleop.coral.l2' },
  { id: 't4', section: 'Teleop', label: 'Teleop Coral L1', type: 'number', path: 'teleop.coral.l1' },
  // Teleop Algae
  { id: 't6', section: 'Teleop', label: 'Teleop Processor', type: 'number', path: 'teleop.algae.processor' },
  { id: 't7', section: 'Teleop', label: 'Teleop Net', type: 'number', path: 'teleop.algae.net' },
  // Defense
  { id: 't9', section: 'Teleop', label: 'Played Defense', type: 'boolean', path: 'teleop.playedDefense' },
  { id: 't10', section: 'Teleop', label: 'Got Defended', type: 'boolean', path: 'teleop.gotDefended' },

  // --- ENDGAME ---
  { id: 'e1', section: 'Endgame', label: 'End State (0=None, 2=Deep)', type: 'number', path: 'endgame.endState', min: 0, max: 3 },
  { id: 'e2', section: 'Endgame', label: 'Defense Rating (1-5)', type: 'number', path: 'endgame.defenseLevel', min: 1, max: 5 },
  { id: 'e3', section: 'Endgame', label: 'Driving Rating (1-5)', type: 'number', path: 'endgame.drivingLevel', min: 1, max: 5 },
  { id: 'e4', section: 'Endgame', label: 'Robot Disabled', type: 'boolean', path: 'endgame.disabled' },
  { id: 'e5', section: 'Endgame', label: 'Comments', type: 'text', path: 'endgame.comments' },
];