import { AlertTriangle } from 'lucide-react';

interface ErrorMessageProps {
  title?: string;
  message: string;
  suggestion?: string;
}

export function ErrorMessage({ title = 'Error', message, suggestion }: ErrorMessageProps) {
  return (
    <div className="bg-red-500/10 border border-red-500 rounded-lg p-6 text-red-400 max-w-xl mx-auto">
      <div className="flex items-start gap-4">
        <AlertTriangle className="w-6 h-6 mt-1 flex-shrink-0" />
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm">{message}</p>
          {suggestion && (
            <p className="text-sm text-red-300 mt-2">{suggestion}</p>
          )}
        </div>
      </div>
    </div>
  );
}