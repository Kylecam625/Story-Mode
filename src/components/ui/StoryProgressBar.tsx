interface StoryProgressBarProps {
  currentMessage: number;
  totalMessages: number;
  decisionsCount: number;
  totalDecisions: number;
}

export function StoryProgressBar({ 
  currentMessage, 
  totalMessages,
  decisionsCount,
  totalDecisions
}: StoryProgressBarProps) {
  const sceneProgress = totalMessages > 0 ? ((currentMessage + 1) / totalMessages) * 100 : 0;
  const gameProgress = totalDecisions > 0 ? (decisionsCount / totalDecisions) * 100 : 0;

  return (
    <div className="w-full relative py-2 mb-8 sticky top-0 z-50">
      <div className="container mx-auto max-w-2xl space-y-2">
        {/* Progress Counters */}
        <div className="flex justify-end gap-2 mb-1">
          <div className="text-sm font-medium text-gray-300 bg-gray-800/50 px-3 py-1 rounded-full backdrop-blur-sm">
            Message: {Math.min(currentMessage, totalMessages)} / {totalMessages}
          </div>
          <div className="text-sm font-medium text-gray-300 bg-gray-800/50 px-3 py-1 rounded-full backdrop-blur-sm">
            Story: {decisionsCount} / {totalDecisions}
          </div>
        </div>

        {/* Scene Progress */}
        <div className="h-2 bg-gray-800/30 rounded-full overflow-hidden backdrop-blur-sm relative shadow-[0_0_8px_rgba(255,255,255,0.5)]">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out relative"
            style={{ width: `${sceneProgress}%` }}
          >
            {/* Gradient glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 blur-md animate-flow" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
          </div>
        </div>

        {/* Game Progress */}
        <div className="h-1 bg-gray-800/30 rounded-full overflow-hidden backdrop-blur-sm relative">
          <div
            className="h-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 transition-all duration-500 ease-out relative"
            style={{ width: `${gameProgress}%` }}
          >
            {/* Gradient glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 via-emerald-500/30 to-teal-500/30 blur-md animate-flow" />
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500" />
          </div>
        </div>
      </div>
    </div>
  );
} 