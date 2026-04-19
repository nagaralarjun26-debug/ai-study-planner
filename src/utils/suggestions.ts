// Utility: Study Suggestions Engine
// Generates rule-based (AI-like) study suggestions based on topics and deadlines
// No external AI API — purely deterministic logic

import type { Subject } from '../services/firestoreService';

export interface Suggestion {
  id: string;
  type: 'warning' | 'info' | 'success' | 'urgent';
  icon: string;
  message: string;
}

/**
 * getSuggestions – Analyses the user's subjects/topics and returns
 * a list of actionable study suggestions.
 *
 * Rules:
 * 1. If overall completion < 30% → encourage focusing on pending topics
 * 2. If any topic deadline is within 3 days → urgent revision alert
 * 3. If all topics are done → celebrate!
 * 4. If no topics exist → prompt user to add some
 * 5. If there are overdue topics → warn the user
 * 6. Motivational tip based on completion rate
 */
export const getSuggestions = (subjects: Subject[]): Suggestion[] => {
  const suggestions: Suggestion[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let totalTopics = 0;
  let completedTopics = 0;
  let urgentTopics = 0;
  let overdueTopics = 0;

  subjects.forEach((subject) => {
    subject.topics.forEach((topic) => {
      totalTopics++;
      if (topic.completed) {
        completedTopics++;
        return;
      }

      if (topic.deadline) {
        const deadline = new Date(topic.deadline);
        deadline.setHours(0, 0, 0, 0);
        const daysLeft = Math.ceil(
          (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysLeft < 0) {
          overdueTopics++; // Past deadline
        } else if (daysLeft <= 3) {
          urgentTopics++; // Deadline within 3 days
        }
      }
    });
  });

  // Rule 1: No subjects added yet
  if (subjects.length === 0) {
    suggestions.push({
      id: 'no-subjects',
      type: 'info',
      icon: '📚',
      message: 'Start by adding your first subject! Break it down into topics with deadlines.',
    });
    return suggestions;
  }

  // Rule 2: No topics at all
  if (totalTopics === 0) {
    suggestions.push({
      id: 'no-topics',
      type: 'info',
      icon: '✏️',
      message: 'Your subjects have no topics yet. Add topics with deadlines to get started!',
    });
    return suggestions;
  }

  // Rule 3: Overdue topics
  if (overdueTopics > 0) {
    suggestions.push({
      id: 'overdue',
      type: 'urgent',
      icon: '🚨',
      message: `You have ${overdueTopics} overdue topic${overdueTopics > 1 ? 's' : ''}! Prioritize catching up immediately.`,
    });
  }

  // Rule 4: Urgent deadlines (within 3 days)
  if (urgentTopics > 0) {
    suggestions.push({
      id: 'urgent',
      type: 'warning',
      icon: '⏰',
      message: `${urgentTopics} topic${urgentTopics > 1 ? 's are' : ' is'} due within 3 days. Revise them today!`,
    });
  }

  // Rule 5: Low overall completion
  const completionRate = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;
  if (completionRate < 30) {
    suggestions.push({
      id: 'low-completion',
      type: 'warning',
      icon: '📉',
      message: `Only ${Math.round(completionRate)}% done overall. Focus on completing your pending topics today!`,
    });
  } else if (completionRate < 70) {
    suggestions.push({
      id: 'mid-completion',
      type: 'info',
      icon: '💪',
      message: `You're at ${Math.round(completionRate)}% — great start! Keep the momentum going.`,
    });
  }

  // Rule 6: Everything completed!
  if (completedTopics === totalTopics && totalTopics > 0) {
    suggestions.push({
      id: 'all-done',
      type: 'success',
      icon: '🎉',
      message: 'Outstanding! You have completed all your topics. Consider adding new ones or revising!',
    });
  }

  // Rule 7: Daily study reminder (always shown as motivation)
  if (completionRate < 100) {
    suggestions.push({
      id: 'daily-reminder',
      type: 'info',
      icon: '🧘',
      message: 'Consistency is key! Aim to study at least 1–2 topics every day.',
    });
  }

  return suggestions;
};
