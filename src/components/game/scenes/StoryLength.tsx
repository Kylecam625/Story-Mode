import { useGameStore } from '../../../store/gameStore';
import { Button } from '../../ui/Button';
import { BackButton } from '../../ui/BackButton';
import { STORY_LENGTHS } from '../../../lib/constants';
import { TypewriterTitle } from '../../ui/TypewriterTitle';

export function StoryLength() {
  const { setStoryLength } = useGameStore();

  return (
    <div className="max-w-md mx-auto space-y-6">
      <BackButton />
      <TypewriterTitle text="Choose Story Length" />
      <p className="text-center text-purple-300">Select how long you want your story to be</p>
      
      <div className="grid gap-4">
        {STORY_LENGTHS.filter(length => length.name !== 'Custom').map((length) => (
          <Button
            key={length.name}
            onClick={() => setStoryLength(length.name, length.decisions)}
            className="w-full"
          >
            <div className="flex justify-between items-center w-full">
              <span>{length.name}</span>
              <span className="text-sm opacity-75">{length.decisions} decisions</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}