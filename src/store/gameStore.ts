import { create } from 'zustand';
import type { GameLog, Scenario } from '../types';

export enum GameState {
  MAIN_MENU = 'MAIN_MENU',
  SETUP_GENRE = 'SETUP_GENRE',
  SETUP_PREMISE = 'SETUP_PREMISE',
  SETUP_CUSTOM_PREMISE = 'SETUP_CUSTOM_PREMISE',
  SETUP_LENGTH = 'SETUP_LENGTH',
  SETUP_CHARACTER = 'SETUP_CHARACTER',
  SETUP_VOICE = 'SETUP_VOICE',
  INITIAL_NARRATION = 'INITIAL_NARRATION',
  ASK_GOAL = 'ASK_GOAL',
  NARRATION = 'NARRATION',
  DECISION = 'DECISION',
  ENDING = 'ENDING'
}

interface GameStore {
  currentState: GameState;
  genre: string;
  premise: string;
  storyLengthMode: string | null;
  decisionCount: number;
  maxDecisions: number;
  characterName: string;
  characterAge: string;
  characterGender: 'male' | 'female';
  characterBackground: string;
  characterVoiceId: string | null;
  narratorVoiceId: string | null;
  gameLog: GameLog[];
  narrativeSummary: string;
  currentScenario: Scenario | null;
  isSoundEnabled: boolean;
  
  setGameState: (state: GameState) => void;
  setGenre: (genre: string) => void;
  setPremise: (premise: string) => void;
  setStoryLength: (length: string, maxDecisions: number) => void;
  setCharacterInfo: (field: string, value: string) => void;
  setVoiceId: (voiceId: string) => void;
  setNarratorVoiceId: (voiceId: string) => void;
  addToGameLog: (log: GameLog) => void;
  incrementDecisionCount: () => void;
  setCurrentScenario: (scenario: Scenario) => void;
  resetGame: () => void;
  setIsSoundEnabled: (enabled: boolean) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  currentState: GameState.MAIN_MENU,
  genre: '',
  premise: '',
  storyLengthMode: null,
  decisionCount: 0,
  maxDecisions: 15,
  characterName: '',
  characterAge: '',
  characterGender: 'male',
  characterBackground: '',
  characterVoiceId: null,
  narratorVoiceId: null,
  gameLog: [],
  narrativeSummary: '',
  currentScenario: null,
  isSoundEnabled: true,
  
  resetGame: () => set({
    currentState: GameState.SETUP_GENRE,
    genre: '',
    premise: '',
    storyLengthMode: null,
    decisionCount: 0,
    maxDecisions: 15,
    characterName: '',
    characterAge: '',
    characterGender: 'male',
    characterBackground: '',
    characterVoiceId: null,
    narratorVoiceId: null,
    gameLog: [],
    narrativeSummary: '',
    currentScenario: null,
  }),
  
  setGameState: (state) => set({ currentState: state }),
  setGenre: (genre) => set({ genre, currentState: GameState.SETUP_PREMISE }),
  setPremise: (premise) => set({ premise, currentState: GameState.SETUP_LENGTH }),
  setStoryLength: (length, maxDecisions) => set({ 
    storyLengthMode: length, 
    maxDecisions,
    currentState: GameState.SETUP_CHARACTER 
  }),
  setCharacterInfo: (field, value) => set((state) => ({
    ...state,
    [field]: value,
  })),
  setVoiceId: (voiceId) => set({ characterVoiceId: voiceId }),
  setNarratorVoiceId: (voiceId) => set({ narratorVoiceId: voiceId }),
  addToGameLog: (log) => set((state) => ({
    gameLog: [...state.gameLog, log],
    decisionCount: state.decisionCount + 1,
  })),
  incrementDecisionCount: () => set((state) => ({
    decisionCount: state.decisionCount + 1
  })),
  setCurrentScenario: (scenario) => set({ currentScenario: scenario }),
  setIsSoundEnabled: (enabled) => set({ isSoundEnabled: enabled }),
}));