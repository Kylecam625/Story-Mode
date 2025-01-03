import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../../../store/gameStore';
import { storyGenerator } from '../../../lib/story/StoryGenerator';
import type { StoryResponse } from '../../../lib/story/types';
import { Message } from '../../ui/Message';
import { ErrorMessage } from '../../ui/ErrorMessage';
import { StoryProgressBar } from '../../ui/StoryProgressBar';
import { GameState } from '../../../types';
import { logger } from '../../../lib/logger';

interface InitialNarrationProps {
  onComplete?: () => void;
}

interface Message {
  type: 'narration' | 'dialogue';
  speaker?: string;
  content: string;
}

// Add mock data at the top of the file
const MOCK_STORY_RESPONSE: StoryResponse = {
  segments: [{
    narration: "The sun hung low in the sky, casting long shadows across the bustling streets of New Metro City. Quick, a 19-year-old with a knack for speed talking, darted through the throngs of people, his heart racing as fast as his legs.",
    dialogue: [
      { character: "Quick", text: "Come on, come on! I can't let them get the drop on me! If I don't get there first, it's game over!" },
      { character: "Buddy", text: "Quick! Wait up! You can't just rush in there without a plan!" },
      { character: "Quick", text: "Plan? Buddy, we don't have time for plans! We need to move!" },
      { character: "Buddy", text: "But what if it's a trap? We could end up walking right into their hands!" }
    ]
  }],
  decisions: [
    { text: "Rush in immediately - time is of the essence", consequences: "High risk, potential ambush" },
    { text: "Take a moment to scout the area", consequences: "Safer approach, but time loss" },
    { text: "Call for backup first", consequences: "More support, but significant delay" },
    { text: "Find an alternative route", consequences: "Avoid main threats, but unknown territory" }
  ]
};

export function InitialNarration({ onComplete }: InitialNarrationProps) {
  // Add testing mode state
  const isTestMode = import.meta.env.DEV || window.location.search.includes('test=true');
  
  console.log('🎮 InitialNarration render - Test Mode:', isTestMode);

  const { 
    characterName,
    characterAge,
    characterBackground,
    genre,
    premise,
    setGameState,
    setCurrentScenario
  } = useGameStore();

  // Core state
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentResponse, setCurrentResponse] = useState<StoryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [decisionsCount, setDecisionsCount] = useState(0);
  const isMounted = useRef(true);
  const isProcessingMessage = useRef(false);
  const hasInitialized = useRef(false);
  const messageTimeoutRef = useRef<NodeJS.Timeout>();

  // Set mounted state
  useEffect(() => {
    console.log('🔄 Component mounted');
    isMounted.current = true;
    return () => {
      console.log('💤 Component unmounting');
      isMounted.current = false;
    };
  }, []);

  // Generate initial scene
  useEffect(() => {
    if (!isMounted.current) {
      console.log('⚠️ Skipping scene generation - component not mounted');
      return;
    }

    console.log('🎬 Initial scene effect triggered', {
      hasInitialized: hasInitialized.current,
      isTestMode,
      characterName,
      genre,
      isMounted: isMounted.current
    });

    const generateInitialScene = async () => {
      if (hasInitialized.current) {
        console.log('⏭️ Scene already initialized, skipping');
        return;
      }
      
      console.log('🚀 Starting scene generation');
      hasInitialized.current = true;

      try {
        let response: StoryResponse;
        
        if (isTestMode) {
          console.log('🧪 Using test mode response');
          response = MOCK_STORY_RESPONSE;
          await new Promise(resolve => setTimeout(resolve, 500));
        } else {
          console.log('📝 Generating real story response');
          response = await storyGenerator.generateOpeningScene({
            characterName,
            characterAge: characterAge || '',
            characterBackground: characterBackground || '',
            genre: genre || '',
            premise: premise || ''
          });
        }

        // Check if still mounted before proceeding
        if (!isMounted.current) {
          console.log('⚠️ Component unmounted during story generation, aborting');
          return;
        }

        console.log('✨ Got story response:', {
          segmentsCount: response.segments.length,
          decisionsCount: response.decisions?.length || 0,
          hasDecisions: !!response.decisions,
          firstSegment: response.segments[0]?.narration.substring(0, 50) + '...'
        });

        const processedMessages = response.segments.flatMap(segment => [
          {
            type: 'narration' as const,
            speaker: 'Narrator',
            content: segment.narration.trim()
          },
          ...segment.dialogue.map(line => ({
            type: 'dialogue' as const,
            speaker: line.character,
            content: line.text.trim()
          }))
        ]);

        console.log('📦 Processed messages:', {
          count: processedMessages.length,
          firstMessage: processedMessages[0]?.content.substring(0, 50) + '...'
        });

        if (isMounted.current) {
          console.log('⚡ Setting initial state');
          setCurrentResponse(response);
          setMessages(processedMessages);
          setCurrentMessageIndex(0);
          setIsPlaying(true);
          setIsLoading(false);
          console.log('✅ Initial state set:', {
            messagesCount: processedMessages.length,
            isLoading: false,
            currentIndex: 0,
            isPlaying: true
          });
        } else {
          console.log('⚠️ Component unmounted, skipping state updates');
        }

      } catch (error) {
        console.error('❌ Scene generation error:', error);
        if (isMounted.current) {
          setError(error instanceof Error ? error.message : 'Failed to generate story');
          setIsLoading(false);
          console.log('🚨 Error state set');
        }
      }
    };

    generateInitialScene();

    return () => {
      console.log('🧹 Cleaning up scene generation effect');
      hasInitialized.current = false;
    };
  }, [characterAge, characterBackground, characterName, genre, premise, isTestMode]);

  // Debug logging for render conditions
  useEffect(() => {
    console.log('🎯 Render conditions:', {
      isLoading,
      hasError: !!error,
      messagesCount: messages.length,
      currentIndex: currentMessageIndex,
      isPlaying,
      shouldShowMessages: !isLoading && !error && messages.length > 0
    });
  }, [isLoading, error, messages.length, currentMessageIndex, isPlaying]);

  const advanceToNextMessage = () => {
    if (!isMounted.current || isProcessingMessage.current) return;
    
    isProcessingMessage.current = true;
    console.log('🔄 Advancing to next message:', { 
      currentIndex: currentMessageIndex, 
      totalMessages: messages.length,
      isPlaying,
      isProcessing: isProcessingMessage.current
    });
    
    // Clear any existing timeout
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
      messageTimeoutRef.current = undefined;
    }

    if (currentMessageIndex < messages.length - 1) {
      const nextIndex = currentMessageIndex + 1;
      console.log('📝 Setting next message:', {
        nextIndex,
        currentIsPlaying: isPlaying,
        nextMessage: messages[nextIndex]
      });
      
      // Set next message and start playing
      setCurrentMessageIndex(nextIndex);
      setIsPlaying(true);
      isProcessingMessage.current = false;
    } else if (currentResponse) {
      handleTransition();
      isProcessingMessage.current = false;
    }
  };

  const handleTransition = () => {
    if (currentResponse && currentResponse.decisions) {
      logger.debug('Transitioning to decision scene...');
      setDecisionsCount(prev => prev + 1);
      setCurrentScenario({
        description: messages[messages.length - 1]?.content || '',
        dialogueLines: [],
        decisions: currentResponse.decisions
      });
      setGameState(GameState.DECISION);
      onComplete?.();
    }
  };

  const handleMessageComplete = () => {
    if (!isMounted.current || isProcessingMessage.current) return;
    isProcessingMessage.current = true;

    // Clear any existing timeout
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
      messageTimeoutRef.current = undefined;
    }

    // Add a small delay before advancing to the next message
    messageTimeoutRef.current = setTimeout(() => {
      if (isMounted.current) {
        advanceToNextMessage();
      }
      isProcessingMessage.current = false;
    }, 500);
  };

  const handleSkip = () => {
    if (!isMounted.current || isProcessingMessage.current) return;
    isProcessingMessage.current = true;

    // Clear any existing timeout
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
      messageTimeoutRef.current = undefined;
    }

    // Only skip the current message
    if (currentMessageIndex < messages.length - 1) {
      setCurrentMessageIndex(prev => prev + 1);
      setIsPlaying(true);
    } else if (currentResponse) {
      handleTransition();
    }
    isProcessingMessage.current = false;
  };

  // Debug logging for state changes
  useEffect(() => {
    logger.debug('State update:', {
      isLoading,
      currentMessageIndex,
      totalMessages: messages.length,
      isPlaying
    });
  }, [isLoading, currentMessageIndex, messages.length, isPlaying]);

  // Monitor isPlaying changes
  useEffect(() => {
    console.log('👀 isPlaying changed:', {
      isPlaying,
      currentIndex: currentMessageIndex,
      currentMessage: messages[currentMessageIndex]?.content.substring(0, 50) + '...'
    });
  }, [isPlaying, currentMessageIndex, messages]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      {!isLoading && !error && messages.length > 0 && (
        <>
          <StoryProgressBar 
            currentMessage={currentMessageIndex} 
            totalMessages={messages.length}
            decisionsCount={decisionsCount}
            totalDecisions={10}
          />
          <div className="container max-w-2xl mx-auto px-4 pb-48">
            {messages.map((message, index) => (
              <Message
                key={`${index}-${message.content}`}
                type={message.type}
                speaker={message.speaker}
                content={message.content}
                isPlaying={index === currentMessageIndex && isPlaying}
                isVisible={index <= currentMessageIndex}
                onComplete={handleMessageComplete}
                onSkip={handleSkip}
              />
            ))}
          </div>
        </>
      )}

      {isLoading && (
        <div className="container max-w-2xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-400">
            Generating your story...
            {isTestMode ? ' (Test Mode)' : ''}
          </p>
        </div>
      )}

      {error && (
        <ErrorMessage message={error} />
      )}
    </>
  );
}