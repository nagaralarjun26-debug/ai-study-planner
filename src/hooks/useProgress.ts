// Custom hook: useProgress
// Calculates study progress from subjects state using useMemo (no extra Firestore reads)

import { useMemo } from 'react';
import { Subject } from '../services/firestoreService';

export interface SubjectProgress {
  subjectId: string;
  subjectName: string;
  total: number;
  completed: number;
  percentage: number; // 0–100
}

export interface OverallProgress {
  totalTopics: number;
  totalCompleted: number;
  overallPercentage: number;
  subjectProgress: SubjectProgress[];
}

/**
 * useProgress – derives progress percentages from subjects list.
 * Uses useMemo so it only recalculates when subjects actually change.
 */
const useProgress = (subjects: Subject[]): OverallProgress => {
  return useMemo(() => {
    let totalTopics = 0;
    let totalCompleted = 0;

    const subjectProgress: SubjectProgress[] = subjects.map((subject) => {
      const total = subject.topics.length;
      const completed = subject.topics.filter((t) => t.completed).length;

      totalTopics += total;
      totalCompleted += completed;

      return {
        subjectId: subject.id,
        subjectName: subject.name,
        total,
        completed,
        // Avoid dividing by zero for subjects with no topics
        percentage: total === 0 ? 0 : Math.round((completed / total) * 100),
      };
    });

    return {
      totalTopics,
      totalCompleted,
      overallPercentage:
        totalTopics === 0 ? 0 : Math.round((totalCompleted / totalTopics) * 100),
      subjectProgress,
    };
  }, [subjects]); // Only recompute if subjects array changes
};

export default useProgress;
