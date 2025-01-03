import { useGameStore } from '../../../store/gameStore';
import { Button } from '../../ui/Button';
import { BackButton } from '../../ui/BackButton';
import { GENRES } from '../../../lib/constants';
import { TypewriterTitle } from '../../ui/TypewriterTitle';

export function GenreSelection() {
  const { setGenre } = useGameStore();

  const handleGenreSelect = (genre: string) => {
    setGenre(genre);
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <BackButton />
      <TypewriterTitle text="Choose Your Genre" />
      <div className="grid gap-4">
        {GENRES.map((genre) => (
          <Button
            key={genre}
            onClick={() => handleGenreSelect(genre)}
            className="w-full"
          >
            {genre}
          </Button>
        ))}
      </div>
    </div>
  );
}