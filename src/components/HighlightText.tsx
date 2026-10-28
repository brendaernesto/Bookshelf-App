import React from 'react';

interface HighlightTextProps {
  text: string;
  query?: string;
  className?: string;
}

export default function HighlightText({ text, query = '', className }: HighlightTextProps) {
  if (!text) return null;
  const trimmed = query.trim();
  if (!trimmed) {
    return <span className={className}>{text}</span>;
  }

  // Escape special regex characters
  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="bg-[#bf6fe5]/35 text-[#f3e5f5] font-semibold rounded-xs px-0.5"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
}
