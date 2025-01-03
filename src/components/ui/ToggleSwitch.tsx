import { useThemeStore } from '../../store/themeStore';

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: () => void;
  description?: string;
}

export function ToggleSwitch({ label, checked, onChange, description }: ToggleSwitchProps) {
  const { currentTheme } = useThemeStore();
  
  return (
    <div className="flex items-start gap-3">
      <button
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
          checked ? 'bg-opacity-100' : 'bg-opacity-30'
        }`}
        style={{
          backgroundColor: currentTheme.primary,
          boxShadow: checked ? `0 0 10px ${currentTheme.primary}40` : 'none'
        }}
      >
        <span
          className={`pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
      <div className="flex flex-col">
        <span className="text-sm font-medium">{label}</span>
        {description && (
          <span className="text-xs opacity-70">{description}</span>
        )}
      </div>
    </div>
  );
}