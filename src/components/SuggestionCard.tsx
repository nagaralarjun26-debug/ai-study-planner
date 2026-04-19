// SuggestionCard: Displays a single AI-like study suggestion
// Shows an icon, colored border, and the suggestion message

import React from 'react';
import { Suggestion } from '../utils/suggestions';

interface SuggestionCardProps {
  suggestion: Suggestion;
}

const SuggestionCard = ({ suggestion }: SuggestionCardProps) => {
  return (
    <div className={`suggestion-card suggestion-${suggestion.type}`}>
      <span className="suggestion-icon" aria-hidden="true">
        {suggestion.icon}
      </span>
      <p className="suggestion-message">{suggestion.message}</p>
    </div>
  );
};

export default SuggestionCard;
