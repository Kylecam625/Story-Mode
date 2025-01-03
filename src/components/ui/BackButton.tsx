import { ArrowLeft } from 'lucide-react';
import { Button } from './Button';
import { useGameStore } from '../../store/gameStore';
import { GameState } from '../../types';

interface BackButtonProps {
  className?: string;
}

export function BackButton({ className = '' }: BackButtonProps) {
  const setGameState = useGameStore((state) => state.setGameState);
  const currentState = useGameStore((state) => state.currentState);

  const getBackState = (): GameState => {
    switch (currentState) {
      case GameState.SETUP_PREMISE:
        return GameState.SETUP_GENRE;
      case GameState.SETUP_CUSTOM_PREMISE:
        return GameState.SETUP_PREMISE;
      case GameState.SETUP_LENGTH:
        return GameState.SETUP_PREMISE;
      case GameState.SETUP_CHARACTER:
        return GameState.SETUP_LENGTH;
      case GameState.SETUP_VOICE:
        return GameState.SETUP_CHARACTER;
      default:
        return GameState.MAIN_MENU;
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setGameState(getBackState())}
      className={`mb-4 ${className}`}
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      Back
    </Button>
  );
}