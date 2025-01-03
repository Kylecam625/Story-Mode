import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { storyGenerator } from '../../lib/story/StoryGenerator';
import { Button } from '../ui/Button';
import type { Decision } from '../../lib/story/types';

export function DecisionManager() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { 
    characterName,
    characterAge,
    characterBackground,
    genre,
    premise,
    currentScenario,
    setCurrentScenario
  } = useGameStore();

  const handleDecision = async (decision: Decision) => {
    try {
      setIsLoading(true);
      const response = await storyGenerator.generateNextScene({
        characterName,
        characterAge: characterAge || '',
        characterBackground: characterBackground || '',
        genre: genre || '',
        premise: premise || '',
        previousScenarios: [],
        currentScenario: {
          description: currentScenario?.description || '',
          dialogueLines: currentScenario?.dialogueLines || []
        },
        selectedDecision: decision
      });
      
      // Process response and update state
      setCurrentScenario({
        description: response.segments[0].narration,
        dialogueLines: response.segments[0].dialogue.map(d => ({
          line: d.text,
          character: d.character
        })),
        decisions: response.decisions
      });
      
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to generate next scene:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate next scene');
      setIsLoading(false);
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4">
      {currentScenario?.decisions.map((decision, index) => (
        <Button
          key={index}
          onClick={() => handleDecision(decision)}
          disabled={isLoading}
          className="w-full"
        >
          {decision.text}
        </Button>
      ))}
    </div>
  );
}