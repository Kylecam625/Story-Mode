export type VoiceGender = 'male' | 'female';

export interface VoiceConfig {
  name: string;
  description: string;
  voiceId: string;
  gender: VoiceGender;
}

export const CHARACTER_VOICES = {
  Milo: {
    name: 'Milo',
    description: 'Energetic young man with a warm, friendly tone',
    voiceId: 'T0pkYhIZ7UMOc26gqqeX',
    gender: 'male' as VoiceGender
  },
  Vanessa: {
    name: 'Vanessa',
    description: 'Confident woman with a melodic, expressive voice',
    voiceId: '8DzKSPdgEQPaK5vKG0Rs',
    gender: 'female' as VoiceGender
  },
  Dusty: {
    name: 'Dusty',
    description: 'Deep, weathered voice with a hint of wisdom',
    voiceId: 'rMKUWjXDUQd4LAVX155A',
    gender: 'male' as VoiceGender
  },
  Ember: {
    name: 'Ember',
    description: 'Warm, nurturing voice with gentle strength',
    voiceId: 'vnd0afTMgWq4fDRVyDo3',
    gender: 'female' as VoiceGender
  }
} satisfies Record<string, VoiceConfig>;

export const NARRATOR_VOICES = {
  Archer: {
    name: 'Archer',
    description: 'Rich, resonant voice perfect for epic tales',
    voiceId: 'L0Dsvb3SLTyegXwtm47J',
    gender: 'male' as VoiceGender
  },
  Luna: {
    name: 'Luna',
    description: 'Enchanting storyteller with ethereal charm',
    voiceId: 'fDeOZu1sNd7qahm2fV4k',
    gender: 'female' as VoiceGender
  },
  Asher: {
    name: 'Asher',
    description: 'Commanding presence with dramatic flair',
    voiceId: 'YXpFCvM1S3JbWEJhoskW',
    gender: 'male' as VoiceGender
  }
} satisfies Record<string, VoiceConfig>;