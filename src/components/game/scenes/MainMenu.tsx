import { useState } from 'react';
import { useGameStore } from '../../../store/gameStore';
import { GameState } from '../../../types';
import { Button } from '../../ui/Button';
import { Beaker, Volume2 } from 'lucide-react';
import { VoiceTest } from '../../game/VoiceTest';
import { TypewriterTitle } from '../../ui/TypewriterTitle';
import { GradientText } from '../../ui/GradientText';

export function MainMenu() {
  const { 
    setGameState,
    setCharacterInfo,
    setGenre,
    setPremise,
    setStoryLength
  } = useGameStore();
  const [showVoiceTest, setShowVoiceTest] = useState(false);

  const handleNewGame = () => {
    setGameState(GameState.SETUP_GENRE);
  };

  const runTest = () => {
    // Set up test scenario
    setCharacterInfo('characterName', 'Quick');
    setCharacterInfo('characterAge', '19');
    setCharacterInfo('characterBackground', 'A fast-talking teenager with a knack for getting into trouble');
    setCharacterInfo('characterGender', 'male');
    setGenre('Cyberpunk');
    setPremise('A high-stakes chase through the neon-lit streets of New Metro City');
    setStoryLength('short', 5);
    setGameState(GameState.SETUP_VOICE);
  };

  return (
    <div className="max-w-md mx-auto text-center space-y-6 mt-20">
      <TypewriterTitle text="Welcome to Story Game" className="text-3xl" />
      
      {/* Main Buttons */}
      <div className="space-y-4">
        <Button
          onClick={handleNewGame}
          className="w-full"
        >
          Start New Game
        </Button>
      </div>

      {/* Test Scenarios Section */}
      <div className="mt-8 pt-8 border-t border-gray-700">
        <h3 className="text-xl font-semibold mb-4 flex items-center justify-center">
          <Beaker className="mr-2" />
          <GradientText>Tests</GradientText>
        </h3>
        <div className="space-y-2">
          <Button 
            onClick={runTest} 
            variant="secondary"
            className="w-full"
          >
            Quick Story Test
          </Button>

          {/* Voice Test Button */}
          <Button
            onClick={() => setShowVoiceTest(true)}
            variant="secondary"
            className="w-full"
          >
            <Volume2 className="mr-2" />
            Test Voices
          </Button>
        </div>
      </div>

      {/* Voice Test Modal */}
      {showVoiceTest && (
        <VoiceTest onClose={() => setShowVoiceTest(false)} />
      )}
    </div>
  );
}