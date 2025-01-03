import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  mouseEffects: boolean;
  typingSound: boolean;
  clickSound: boolean;
  particleEffects: boolean;
  particleCount: number;
  mouseTrail: boolean;
  showTerminalHint: boolean;
  autoAdvanceText: boolean;
  narrativeAudio: boolean;
  narrativeSpeed: number;
  
  toggleMouseEffects: () => void;
  toggleTypingSound: () => void;
  toggleClickSound: () => void;
  toggleParticleEffects: () => void;
  setParticleCount: (count: number) => void;
  toggleMouseTrail: () => void;
  toggleTerminalHint: () => void;
  toggleAutoAdvanceText: () => void;
  toggleNarrativeAudio: () => void;
  setNarrativeSpeed: (speed: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      mouseEffects: true,
      typingSound: true,
      clickSound: true,
      particleEffects: true,
      particleCount: 500,
      mouseTrail: true,
      showTerminalHint: true,
      autoAdvanceText: true,
      narrativeAudio: true,
      narrativeSpeed: 35,
      
      toggleMouseEffects: () => set(state => ({ mouseEffects: !state.mouseEffects })),
      toggleTypingSound: () => set(state => ({ typingSound: !state.typingSound })),
      toggleClickSound: () => set(state => ({ clickSound: !state.clickSound })),
      toggleParticleEffects: () => set(state => ({ particleEffects: !state.particleEffects })),
      setParticleCount: (count) => set({ particleCount: count }),
      toggleMouseTrail: () => set(state => ({ mouseTrail: !state.mouseTrail })),
      toggleTerminalHint: () => set(state => ({ showTerminalHint: !state.showTerminalHint })),
      toggleAutoAdvanceText: () => set(state => ({ autoAdvanceText: !state.autoAdvanceText })),
      toggleNarrativeAudio: () => set(state => ({ narrativeAudio: !state.narrativeAudio })),
      setNarrativeSpeed: (speed) => set({ narrativeSpeed: speed })
    }),
    {
      name: 'settings-storage'
    }
  )
);