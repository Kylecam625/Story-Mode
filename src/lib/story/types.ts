export interface DialogueLine {
  character: string;
  gender?: 'male' | 'female';
  text: string;
}

export interface Decision {
  text: string;
  consequences: string;
}

export interface StorySegment {
  narration: string;
  dialogue: DialogueLine[];
}

export interface StoryResponse {
  segments: StorySegment[];
  decisions?: Decision[];
  characters?: Array<{
    name: string;
    gender: 'male' | 'female';
  }>;
}

export interface StoryGenerationParams {
  characterName: string;
  characterAge: string;
  characterBackground: string;
  genre: string;
  premise: string;
}