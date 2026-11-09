export interface Level {
  id: number;
  title: string;
  bg: string;
  icon: string;
  desc: string;
  intro: string;
  objective: string;
  condition: string;
  questions: number;
  passScore: number;
  type: 'energy' | 'timer' | 'lives' | 'boss' | 'suddenDeath';
  isSecret?: boolean;
}

export interface Problem {
  display: string;
  answer: number;
  explanation: string;
}

export interface LevelHistoryItem {
  bestScore: number;
  max: number;
  pct: number;
  passed: boolean;
}

export interface SkillStats {
  addsub: number;
  multdiv: number;
  agility: number;
  logic: number;
}

export interface StudentResult {
  id: string;
  username: string;
  code: string;
  date: string;
  totalScore: number;
  precision: number;
  levelHistory: Record<number, LevelHistoryItem>;
}

export interface ClassroomCode {
  code: string;
  description: string;
  createdAt: string;
}

export interface PlayerState {
  username: string;
  avatarIndex: number;
  unlockedLevels: number[];
  completedLevels: number[];
  totalScore: number;
  levelHistory: Record<number, LevelHistoryItem>;
  skillStats: SkillStats;
  currentClassCode: string;
}

export interface DialogueStep {
  text: string;
  emotion: string;
}
