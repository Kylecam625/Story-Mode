interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
}

export function GradientText({ children, className = '' }: GradientTextProps) {
  return (
    <span 
      className={`bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text bg-[length:200%_auto] animate-flow ${className}`}
    >
      {children}
    </span>
  );
} 