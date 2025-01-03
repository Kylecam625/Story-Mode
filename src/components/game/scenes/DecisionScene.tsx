import { useState, useRef, useEffect, memo } from 'react';
import { useGameStore } from '../../../store/gameStore';
import { storyGenerator } from '../../../lib/story/StoryGenerator';
import { Message } from '../../ui/Message';
import { StoryProgressBar } from '../../ui/StoryProgressBar';
import { GradientText } from '../../ui/GradientText';
import { Dialog } from '@headlessui/react';
import { Button } from '../../ui/Button';
import { TimedSlotMachine, TimedSlotMachineHandle } from '../TimedSlotMachine';
import { StoryHistory } from '../StoryHistory';

interface StoryHistoryItem {
  description: string;
  dialogueLines: Array<{ character: string; line: string }>;
  selectedDecision: { text: string; consequences: string };
}

// Memoized message component to prevent re-renders
const MemoizedMessage = memo(Message);

// Add mock data at the top of the file
const MOCK_MESSAGES = [
  {
    type: 'narration' as const,
    content: "The sun hung low in the sky, casting long shadows across the bustling streets of New Metro City. Quick, a 19-year-old with a knack for speed talking, darted through the throngs of people, his heart racing as fast as his legs.",
    speaker: 'Narrator'
  },
  {
    type: 'dialogue' as const,
    content: "Come on, come on! I can't let them get the drop on me! If I don't get there first, it's game over!",
    speaker: 'Quick'
  },
  {
    type: 'dialogue' as const,
    content: "Quick! Wait up! You can't just rush in there without a plan!",
    speaker: 'Buddy'
  },
  {
    type: 'dialogue' as const,
    content: "Plan? Buddy, we don't have time for plans! We need to move!",
    speaker: 'Quick'
  },
  {
    type: 'dialogue' as const,
    content: "But what if it's a trap? We could end up walking right into their hands!",
    speaker: 'Buddy'
  }
];

// Add new interface for chapters
interface Chapter {
  messages: typeof MOCK_MESSAGES;
  decision?: string;
}

// Add ViewHistoryButton component
const ViewHistoryButton = memo(function ViewHistoryButton({ 
  onClick 
}: { 
  onClick: () => void 
}) {
  return (
    <div className="flex justify-center mb-4">
      <button
        onClick={onClick}
        className="bg-purple-600/90 hover:bg-purple-700 text-white px-4 py-2 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105 text-sm font-medium"
      >
        View Full History
      </button>
    </div>
  );
});

const DecisionSection = memo(function DecisionSection({
  currentScenario,
  isLoading,
  handleDecisionSelect,
  onSlotMachineComplete,
  slotMachineRef
}: {
  currentScenario: any;
  isLoading: boolean;
  handleDecisionSelect: (decision: any, index: number) => void;
  onSlotMachineComplete: (selectedIndex: number) => void;
  slotMachineRef: React.RefObject<TimedSlotMachineHandle>;
}) {
  return (
    <div className="fixed left-0 right-0 bottom-[200px] z-20">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="bg-gray-900/95 backdrop-blur-sm p-6 rounded-lg border border-gray-800 shadow-xl">
          <h2 className="text-xl font-semibold mb-4">
            <GradientText className="font-bold inline-block">What will you do?</GradientText>
          </h2>
          <TimedSlotMachine
            ref={slotMachineRef}
            decisions={currentScenario.decisions}
            isLoading={isLoading}
            onDecisionSelect={handleDecisionSelect}
            onComplete={onSlotMachineComplete}
          />
        </div>
      </div>
    </div>
  );
});

export function DecisionScene() {
  const { 
    currentScenario,
    setCurrentScenario,
    characterName = '',
    characterAge = '',
    characterBackground = '',
    genre = '',
    premise = '',
    gameLog,
    decisionCount,
    maxDecisions
  } = useGameStore();

  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [, setSelectedDecisionIndex] = useState<number | null>(null);
  const [storyHistory, setStoryHistory] = useState<StoryHistoryItem[]>([]);
  const [, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isProcessingMessage = useRef(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [allMessages, setAllMessages] = useState<any[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [autoSelectedIndex, setAutoSelectedIndex] = useState<number | null>(null);
  const [, setRetryCount] = useState(0);
  const slotMachineRef = useRef<TimedSlotMachineHandle>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [totalMessages, setTotalMessages] = useState(MOCK_MESSAGES.length);

  // Initialize all messages when component mounts or gameLog/currentScenario changes
  useEffect(() => {
    const isTestMode = import.meta.env.DEV || window.location.search.includes('test=true');
    let allSceneMessages = [];
    let displayMessages = [];
    
    if (isTestMode) {
      allSceneMessages = MOCK_MESSAGES;
      displayMessages = MOCK_MESSAGES.slice(-3);
    } else {
      if (gameLog && gameLog.length > 0) {
        const lastLogEntry = gameLog[gameLog.length - 1];
        allSceneMessages.push({
          type: 'narration' as const,
          content: lastLogEntry.description,
          speaker: 'Narrator'
        });
        if (lastLogEntry.dialogue) {
          allSceneMessages.push(...lastLogEntry.dialogue.map(line => ({
            type: 'dialogue' as const,
            speaker: line.character,
            content: line.line
          })));
        }
      }

      if (currentScenario) {
        allSceneMessages.push({
          type: 'narration' as const,
          content: currentScenario.description,
          speaker: 'Narrator'
        });
        if (currentScenario.dialogueLines && currentScenario.dialogueLines.length > 0) {
          allSceneMessages.push(...currentScenario.dialogueLines.map(line => ({
            type: 'dialogue' as const,
            speaker: line.character,
            content: line.line
          })));
        }
      }
      displayMessages = allSceneMessages.slice(-3);
    }

    setAllMessages(displayMessages);
    setCurrentMessageIndex(allSceneMessages.length);
    setTotalMessages(allSceneMessages.length);
    setIsComplete(true);
    isProcessingMessage.current = false;
  }, [gameLog, currentScenario]);

  // Handle scroll button visibility
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollButton(!isNearBottom);
  };

  useEffect(() => {
    handleScroll();
  }, [gameLog]);

  const handleDecisionSelect = async (decision: any, index: number) => {
    if (!currentScenario || isLoading) return;

    setIsLoading(true);
    setSelectedDecisionIndex(index);

    try {
      const response = await storyGenerator.generateNextScene({
        characterName,
        characterAge,
        characterBackground,
        genre,
        premise,
        previousScenarios: storyHistory,
        currentScenario: {
          description: currentScenario.description,
          dialogueLines: currentScenario.dialogueLines
        },
        selectedDecision: decision
      });

      if (!response) {
        throw new Error('No response from story generator');
      }

      // Add current scenario to history
      setStoryHistory(prev => [...prev, {
        description: currentScenario.description,
        dialogueLines: currentScenario.dialogueLines,
        selectedDecision: decision
      }]);

      // Update game state to show narration
      setCurrentScenario({
        description: response.segments[0].narration,
        dialogueLines: response.segments[0].dialogue.map(d => ({
          character: d.character,
          line: d.text
        })),
        decisions: response.decisions || []
      });

    } catch (error) {
      console.error('[DecisionScene] Error generating next scene:', error);
      setSelectedDecisionIndex(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmation = (confirmed: boolean) => {
    if (confirmed && autoSelectedIndex !== null && currentScenario && currentScenario.decisions) {
      handleDecisionSelect(currentScenario.decisions[autoSelectedIndex], autoSelectedIndex);
      setRetryCount(0);
    } else {
      setShowConfirmation(false);
      setAutoSelectedIndex(null);
      if (slotMachineRef.current) {
        slotMachineRef.current.reset();
      }
      setRetryCount(prev => prev + 1);
    }
  };

  // Mock chapters for test mode
  const chapters: Chapter[] = [
    {
      messages: MOCK_MESSAGES,
      decision: undefined
    }
  ];

  if (!currentScenario || !currentScenario.decisions) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <div className="bg-red-800/20 text-red-200 p-4 rounded">
          Error: No decisions available
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <StoryProgressBar
        currentMessage={currentMessageIndex}
        totalMessages={totalMessages}
        decisionsCount={Math.min(decisionCount, maxDecisions)}
        totalDecisions={maxDecisions}
      />
      
      <div className="container max-w-2xl mx-auto px-4 py-8 flex-grow flex flex-col relative">
        <ViewHistoryButton onClick={() => setIsHistoryOpen(true)} />

        <div 
          ref={scrollContainerRef}
          className="flex-grow overflow-y-auto space-y-4 pr-2 custom-scrollbar mb-[45vh]"
          onScroll={handleScroll}
        >
          <div className="space-y-4 relative">
            {allMessages.map((message, index) => (
              <div key={`message-container-${index}`} className="relative">
                {index > 0 && (
                  <div className="absolute -top-3 left-1/2 w-16 h-px -translate-x-1/2 bg-purple-500/20" />
                )}
                <MemoizedMessage
                  key={`message-${index}`}
                  type={message.type}
                  speaker={message.speaker}
                  content={message.content}
                  isVisible={true}
                  isPlaying={false}
                />
              </div>
            ))}
          </div>
          <div ref={messagesEndRef} />
        </div>

        {isComplete && (
          <DecisionSection
            currentScenario={currentScenario}
            isLoading={isLoading}
            handleDecisionSelect={handleDecisionSelect}
            onSlotMachineComplete={(selectedIndex) => {
              setAutoSelectedIndex(selectedIndex);
              setShowConfirmation(true);
            }}
            slotMachineRef={slotMachineRef}
          />
        )}
      </div>

      <StoryHistory
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        chapters={chapters}
      />

      <Dialog
        open={showConfirmation}
        onClose={() => {}}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/80" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-gray-900/95 rounded-xl max-w-md w-full p-6 shadow-xl border border-gray-800">
            <Dialog.Title className="text-xl font-bold mb-4">
              <GradientText>Time's Up!</GradientText>
            </Dialog.Title>
            <p className="text-gray-300 mb-6">
              The timer has selected this option for you:
              {autoSelectedIndex !== null && (
                <span className="block mt-2 text-purple-300 font-medium">
                  "{currentScenario.decisions[autoSelectedIndex].text}"
                </span>
              )}
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => handleConfirmation(false)}
              >
                Choose Again
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleConfirmation(true)}
              >
                Accept
              </Button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}