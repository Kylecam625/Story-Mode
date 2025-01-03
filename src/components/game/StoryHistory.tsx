import { memo, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { GradientText } from '../ui/GradientText';
import { Message } from '../ui/Message';

// Memoized message component to prevent re-renders
const MemoizedMessage = memo(Message);

interface Chapter {
  messages: Array<{
    type: 'narration' | 'dialogue';
    content: string;
    speaker: string;
  }>;
  decision?: string;
}

interface StoryHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  chapters: Chapter[];
}

export const StoryHistory = memo(function StoryHistory({
  isOpen,
  onClose,
  chapters
}: StoryHistoryProps) {
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);

  // Component for rendering a single chapter
  const ChapterContent = memo(function ChapterContent({ 
    chapter, 
    index 
  }: { 
    chapter: Chapter; 
    index: number 
  }) {
    return (
      <div className="space-y-4">
        <div className="space-y-4">
          {chapter.messages.map((message, msgIndex) => (
            <div key={`chapter-${index}-message-${msgIndex}`} className="relative">
              {msgIndex > 0 && (
                <div className="absolute -top-2 left-1/2 w-16 h-px -translate-x-1/2 bg-purple-500/20" />
              )}
              <MemoizedMessage
                type={message.type}
                speaker={message.speaker}
                content={message.content}
                isVisible={true}
                isPlaying={false}
              />
            </div>
          ))}
        </div>
        {chapter.decision && index > 0 && (
          <div className="mt-4 p-4 bg-purple-900/20 border border-purple-500/20 rounded-lg">
            <div className="text-sm text-purple-300 mb-1">Selected Choice:</div>
            <div className="text-white">{chapter.decision}</div>
          </div>
        )}
      </div>
    );
  });

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/80" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-gray-900/95 rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden shadow-xl border border-gray-800">
          <div className="p-6 flex justify-between items-center border-b border-gray-800">
            <Dialog.Title className="text-xl font-bold">
              <GradientText>Story History</GradientText>
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex h-[calc(80vh-8rem)]">
            <div className="w-48 border-r border-gray-800 p-4 space-y-2">
              {chapters.map((_, index) => (
                <button
                  key={`chapter-${index}`}
                  onClick={() => setSelectedChapter(index)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    selectedChapter === index
                      ? 'bg-purple-600/20 text-purple-300'
                      : 'hover:bg-gray-800/50'
                  }`}
                >
                  Chapter {index + 1}
                </button>
              ))}
            </div>

            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
              {selectedChapter !== null ? (
                <ChapterContent
                  chapter={chapters[selectedChapter]}
                  index={selectedChapter}
                />
              ) : (
                <div className="text-gray-400 text-center mt-8">
                  Select a chapter to view its contents
                </div>
              )}
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}); 