import { useGameStore } from '../../../store/gameStore';
import { GameState } from '../../../types';
import { Button } from '../../ui/Button';
import { BackButton } from '../../ui/BackButton';
import { GENRE_PREMISES } from '../../../lib/constants/premises';
import { TypewriterTitle } from '../../ui/TypewriterTitle';

export function PremiseSelection() {
  const { setPremise, genre, setGameState } = useGameStore();
  
  // If no genre is selected or genre is invalid, go back to genre selection
  if (!genre || !(genre in GENRE_PREMISES)) {
    setGameState(GameState.SETUP_GENRE);
    return null;
  }
  
  const premises = GENRE_PREMISES[genre as keyof typeof GENRE_PREMISES] || [];

  const handleCustomPremise = () => {
    setGameState(GameState.SETUP_CUSTOM_PREMISE);
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <BackButton />
      <TypewriterTitle text="Choose Your Premise" />
      <p className="text-center text-purple-300">Select the starting point for your {genre} story</p>
      <div className="grid gap-4">
        {premises.length > 0 ? (
          <>
            {premises.map((premise) => (
              <Button
                key={premise}
                onClick={() => setPremise(premise)}
                className="w-full text-left"
              >
                {premise}
              </Button>
            ))}
            <Button
              onClick={handleCustomPremise}
              variant="secondary"
              className="w-full text-left"
            >
              Write Your Own Premise
            </Button>
          </>
        ) : (
          <Button
            onClick={() => setGameState(GameState.SETUP_GENRE)}
            variant="secondary"
            className="w-full text-center"
          >
            Return to Genre Selection
          </Button>
        )}
      </div>
    </div>
  );
}