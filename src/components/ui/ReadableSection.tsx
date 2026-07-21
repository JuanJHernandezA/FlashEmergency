import { useRef } from 'react';
import { Volume2 } from 'lucide-react';
import useReadOnHover from '../../hooks/useReadOnHover';

interface IReadableSectionProps {
  children: React.ReactNode;
  text: string;
  lang?: string;
  className?: string;
  showIcon?: boolean;
}

function ReadableSection({ children, text, lang, className = '', showIcon = true }: IReadableSectionProps) {
  const { onMouseEnter, onMouseLeave } = useReadOnHover();
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className={`group/readable relative ${className}`}
      onMouseEnter={() => onMouseEnter(text, lang)}
      onMouseLeave={onMouseLeave}
    >
      {showIcon && (
        <div className="pointer-events-none absolute right-2 top-2 z-10 opacity-0 transition-opacity duration-200 group-hover/readable:opacity-60">
          <Volume2 size={12} className="text-text-muted" />
        </div>
      )}
      {children}
    </div>
  );
}

export default ReadableSection;
