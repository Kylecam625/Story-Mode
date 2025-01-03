import { useGameStore } from '../store/gameStore';
import { GameState } from '../types';
import { Header } from './game/Header';
import { backgroundMusic } from '../lib/audio';
import { useThemeStore } from '../store/themeStore';
import { MainMenu } from './game/scenes/MainMenu';
import { GenreSelection } from './game/scenes/GenreSelection';
import { PremiseSelection } from './game/scenes/PremiseSelection';
import { CustomPremise } from './game/scenes/CustomPremise';
import { StoryLength } from './game/scenes/StoryLength';
import { CharacterSetup } from './game/scenes/CharacterSetup';
import { VoiceSelection } from './game/scenes/VoiceSelection';
import { InitialNarration } from './game/scenes/InitialNarration';
import { DecisionScene } from './game/scenes/DecisionScene';
import { ProgressBar } from './ui/ProgressBar';
import { AudioControls } from './ui/AudioControls';
import { ParticleBackground } from './ui/ParticleBackground';
import { ThemeSettings } from './ui/ThemeSettings';
import { MouseTrail } from './ui/MouseTrail';

export function GameUI() {
  const { 
    currentState,
    genre,
    characterName,
    decisionCount,
    maxDecisions  } = useGameStore();
  const { currentTheme } = useThemeStore();

  const renderContent = () => {
    switch (currentState) {
      case GameState.MAIN_MENU:
        return <MainMenu />;
      case GameState.SETUP_GENRE:
        return <GenreSelection />;
      case GameState.SETUP_PREMISE:
        return <PremiseSelection />;
      case GameState.SETUP_CUSTOM_PREMISE:
        return <CustomPremise />;
      case GameState.SETUP_LENGTH:
        return <StoryLength />;
      case GameState.SETUP_CHARACTER:
        return <CharacterSetup />;
      case GameState.SETUP_VOICE:
        return <VoiceSelection />;
      case GameState.INITIAL_NARRATION:
        return (
          <InitialNarration />
        );
      case GameState.DECISION:
        return <DecisionScene />;
      default:
        return <div>Loading...</div>;
    }
  };

  return (
    <div 
      className="min-h-screen overflow-x-hidden transition-colors duration-300"
      style={{ 
        backgroundColor: currentTheme.background,
        color: currentTheme.text
      }}
    >
      <ParticleBackground 
        color={currentTheme.particleColor} 
        audioAnalyzer={backgroundMusic.getAnalyzer() || undefined}
      />
      <div className="relative z-1">
        <MouseTrail />
        <ThemeSettings />
        <Header characterName={characterName} genre={genre} />
        
        {currentState !== GameState.MAIN_MENU && (
          <ProgressBar value={decisionCount} max={maxDecisions} />
        )}

        <main className="container mx-auto px-4">
          {renderContent()}
        </main>

        <AudioControls />
      </div>
    </div>
  );
}