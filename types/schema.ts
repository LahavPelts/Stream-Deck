export interface CoralScoring {
  l4: number;
  l3: number;
  l2: number;
  l1: number;
  missedL4: number;
  missedL3: number;
  missedL2: number;
  missedL1: number;
}

export interface AlgaeScoring {
  processor: number;
  net: number;
  missedProcessor: number;
  missedNet: number;
}

export interface MatchInfo {
  type: 'Q' | 'P' | 'E' | 'F';
  number: number;
  teamNumber: string; // Changed to string to handle input better
  alliance: 'R' | 'B' | '';
  startingPosition: number; // 1-5
}

export interface AutoData {
  crossedLine: boolean;
  mobility: boolean;
  startedWithGamePiece: boolean;
  coral: CoralScoring;
  algae: AlgaeScoring;
  algaePickup: { reef: boolean; processor: boolean };
  coralPickup: { hp: boolean; ground: boolean };
}

export interface TeleopData {
  coral: CoralScoring;
  algae: AlgaeScoring;
  playedDefense: boolean;
  gotDefended: boolean;
  algaePickup: { reef: boolean; processor: boolean };
  coralPickup: { hp: boolean; ground: boolean };
}

export interface EndgameData {
  endState: number; // 0: None, 1: Park, 2: Deep, 3: Shallow
  defenseLevel: number | null; // 1-5
  drivingLevel: number | null; // 1-5
  disabled: boolean;
  comments: string;
  fouls: number;
  techFouls: number;
  yellowCard: boolean;
  redCard: boolean;
}

export interface MatchData {
  id: string; // Unique ID
  timestamp: number;
  match: MatchInfo;
  auto: AutoData;
  teleop: TeleopData;
  endgame: EndgameData;
}

export const INITIAL_MATCH_DATA: MatchData = {
  id: '',
  timestamp: 0,
  match: {
    type: 'Q',
    number: 1,
    teamNumber: '',
    alliance: 'R',
    startingPosition: 0,
  },
  auto: {
    crossedLine: false,
    mobility: false,
    startedWithGamePiece: false,
    coral: { l4: 0, l3: 0, l2: 0, l1: 0, missedL4: 0, missedL3: 0, missedL2: 0, missedL1: 0 },
    algae: { processor: 0, net: 0, missedProcessor: 0, missedNet: 0 },
    algaePickup: { reef: false, processor: false },
    coralPickup: { hp: false, ground: false },
  },
  teleop: {
    coral: { l4: 0, l3: 0, l2: 0, l1: 0, missedL4: 0, missedL3: 0, missedL2: 0, missedL1: 0 },
    algae: { processor: 0, net: 0, missedProcessor: 0, missedNet: 0 },
    playedDefense: false,
    gotDefended: false,
    algaePickup: { reef: false, processor: false },
    coralPickup: { hp: false, ground: false },
  },
  endgame: {
    endState: 0,
    defenseLevel: null,
    drivingLevel: null,
    disabled: false,
    comments: '',
    fouls: 0,
    techFouls: 0,
    yellowCard: false,
    redCard: false,
  },
};