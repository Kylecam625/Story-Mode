import { Terminal as TerminalIcon } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { formatJson } from '../../lib/utils/formatJson';

interface TerminalProps {
  output: string;
  isOpen: boolean;
  onClose: () => void;
}

export function Terminal({ output, isOpen, onClose }: TerminalProps) {
  const { currentTheme } = useThemeStore();

  if (!isOpen) return null;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md border-t border-gray-800"
      style={{ maxHeight: '30vh' }}
    >
      <div className="flex items-center justify-between p-2 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4" />
          <span className="text-sm font-mono">GPT Output</span>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          ×
        </button>
      </div>
      <div className="p-4 font-mono text-sm overflow-auto custom-scrollbar" style={{ maxHeight: 'calc(30vh - 40px)' }}>
        <pre className="whitespace-pre" style={{ color: currentTheme.text }}>
          {formatJson(output)}
        </pre>
      </div>
    </div>
  );
}