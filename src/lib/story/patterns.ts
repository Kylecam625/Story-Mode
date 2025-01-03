export type ScenePattern = {
  name: string;
  description: string;
  flow: Array<{
    type: 'narration' | 'dialogue';
    count?: number;
    minSentences?: number;
    maxSentences?: number;
  }>;
};

export const SCENE_PATTERNS: ScenePattern[] = [
  {
    name: 'Narrative Focus',
    description: 'Heavy on narration with occasional dialogue',
    flow: [
      { type: 'narration', minSentences: 3, maxSentences: 4 },
      { type: 'dialogue', count: 1 },
      { type: 'narration', minSentences: 2, maxSentences: 3 },
      { type: 'dialogue', count: 1 },
      { type: 'narration', minSentences: 2, maxSentences: 3 }
    ]
  },
  {
    name: 'Dialogue Heavy',
    description: 'Character-driven with dialogue breaks',
    flow: [
      { type: 'narration', minSentences: 2, maxSentences: 3 },
      { type: 'dialogue', count: 2 },
      { type: 'narration', minSentences: 1, maxSentences: 2 },
      { type: 'dialogue', count: 2 },
      { type: 'narration', minSentences: 2, maxSentences: 3 }
    ]
  },
  {
    name: 'Balanced',
    description: 'Equal mix of narration and dialogue',
    flow: [
      { type: 'narration', minSentences: 2, maxSentences: 3 },
      { type: 'dialogue', count: 1 },
      { type: 'narration', minSentences: 2, maxSentences: 3 },
      { type: 'dialogue', count: 1 },
      { type: 'narration', minSentences: 2, maxSentences: 3 },
      { type: 'dialogue', count: 1 }
    ]
  }
];