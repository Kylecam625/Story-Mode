export interface DialogueLine {
  character: string;
  line: string;
}

export interface Scenario {
  id?: string;
  description: string;
  dialogueLines: DialogueLine[];
  decisions: Array<{
    text: string;
    consequences: string;
  }>;
}

export interface GameLog {
  decisionNumber: number;
  description: string;
  dialogue: DialogueLine[];
  chosenDecision: string;
}

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