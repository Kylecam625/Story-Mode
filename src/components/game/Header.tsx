import { Book } from 'lucide-react';

interface HeaderProps {
  characterName?: string;
  genre?: string;
}

export function Header({ characterName, genre }: HeaderProps) {
  return (
    <header className="bg-gray-800/50 p-4 shadow-lg backdrop-blur-sm border-b border-gray-700/50">
      <div className="container mx-auto flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2 order-1 sm:order-2">
          <Book className="h-6 w-6 text-purple-400" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Story Mode
          </h1>
        </div>

        <div className="flex gap-4 text-sm text-gray-400 order-2 sm:order-1">
          {characterName && (
            <div className="flex items-center gap-1">
              <span className="text-purple-400">Playing as:</span>
              <span className="text-gray-200">{characterName}</span>
            </div>
          )}
        </div>

        <div className="flex gap-4 text-sm text-gray-400 order-3">
          {genre && (
            <div className="flex items-center gap-1">
              <span className="text-purple-400">Genre:</span>
              <span className="text-gray-200">{genre}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}