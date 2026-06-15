'use client';

import { MessageSquare } from 'lucide-react';
import { useState } from 'react';

export default function ExpandableMessage({ message }: { message: string }) {
  const [expanded, setExpanded] = useState(false);
  const CHARACTER_LIMIT = 50;

  const isLongMessage = message.length > CHARACTER_LIMIT;

  // Determine what text to display
  const displayedMessage = isLongMessage && !expanded
    ? `"${message.slice(0, CHARACTER_LIMIT)}...`
    : `"${message}"`;

  return (
    <div className="flex gap-3 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-100 dark:border-zinc-900 px-4 py-3.5 rounded-xl text-xs mb-4 leading-relaxed items-start">
      <MessageSquare className="w-3 h-3 text-zinc-400 shrink-0 mt-0.5" />
      <div>
        <p className="italic inline">
          {displayedMessage}
        </p>

        {isLongMessage && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-1.5 text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 font-semibold transition-colors not-italic inline-block cursor-pointer"
          >
            {expanded ? 'show less' : 'show more'}
          </button>
        )}
      </div>
    </div>
  );
}
