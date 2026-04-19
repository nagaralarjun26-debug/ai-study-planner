// StudyContext: Global state for subjects and topics
// Manages fetching, adding, deleting, and toggling topics across the app

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import {
  Subject,
  getSubjects,
  addSubject as fsAddSubject,
  deleteSubject as fsDeleteSubject,
  addTopic as fsAddTopic,
  toggleTopicComplete as fsToggleTopicComplete,
  deleteTopic as fsDeleteTopic,
  updateSubjectName as fsUpdateSubjectName,
  updateTopic as fsUpdateTopic,
} from '../services/firestoreService';
import { useAuth } from './AuthContext';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface StudyContextType {
  subjects: Subject[];
  loadingData: boolean;
  fetchSubjects: () => Promise<void>;
  addSubject: (name: string) => Promise<void>;
  deleteSubject: (subjectId: string) => Promise<void>;
  updateSubjectName: (subjectId: string, newName: string) => Promise<void>;
  addTopic: (subjectId: string, title: string, deadline: string) => Promise<void>;
  toggleTopicComplete: (subjectId: string, topicId: string, currentStatus: boolean) => Promise<void>;
  deleteTopic: (subjectId: string, topicId: string) => Promise<void>;
  updateTopic: (subjectId: string, topicId: string, updates: { title?: string; deadline?: string }) => Promise<void>;
}

// ─── Context ───────────────────────────────────────────────────────────────────

const StudyContext = createContext<StudyContextType | undefined>(undefined);

// ─── Provider ──────────────────────────────────────────────────────────────────

export const StudyProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Fetch all subjects from Firestore for the current user
  const fetchSubjects = useCallback(async () => {
    if (!currentUser) return;
    setLoadingData(true);
    try {
      const data = await getSubjects(currentUser.uid);
      setSubjects(data);
    } catch (err) {
      console.error('Error fetching subjects:', err);
    } finally {
      setLoadingData(false);
    }
  }, [currentUser]);

  // Auto-fetch when the user changes (login/logout)
  useEffect(() => {
    if (currentUser) {
      fetchSubjects();
    } else {
      setSubjects([]);
      setLoadingData(false);
    }
  }, [currentUser, fetchSubjects]);

  // ── Subject CRUD ────────────────────────────────────────────────────────────

  const addSubject = async (name: string) => {
    if (!currentUser) return;
    await fsAddSubject(name, currentUser.uid);
    await fetchSubjects(); // Re-sync after write
  };

  const deleteSubject = async (subjectId: string) => {
    if (!currentUser) return;
    await fsDeleteSubject(currentUser.uid, subjectId);
    await fetchSubjects();
  };

  const updateSubjectName = async (subjectId: string, newName: string) => {
    if (!currentUser) return;
    await fsUpdateSubjectName(currentUser.uid, subjectId, newName);
    await fetchSubjects();
  };

  // ── Topic CRUD ──────────────────────────────────────────────────────────────

  const addTopic = async (subjectId: string, title: string, deadline: string) => {
    if (!currentUser) return;
    await fsAddTopic(currentUser.uid, subjectId, title, deadline);
    await fetchSubjects();
  };

  const toggleTopicComplete = async (
    subjectId: string,
    topicId: string,
    currentStatus: boolean
  ) => {
    if (!currentUser) return;
    await fsToggleTopicComplete(currentUser.uid, subjectId, topicId, currentStatus);
    await fetchSubjects();
  };

  const deleteTopic = async (subjectId: string, topicId: string) => {
    if (!currentUser) return;
    await fsDeleteTopic(currentUser.uid, subjectId, topicId);
    await fetchSubjects();
  };

  const updateTopic = async (
    subjectId: string,
    topicId: string,
    updates: { title?: string; deadline?: string }
  ) => {
    if (!currentUser) return;
    await fsUpdateTopic(currentUser.uid, subjectId, topicId, updates);
    await fetchSubjects();
  };

  const value: StudyContextType = {
    subjects,
    loadingData,
    fetchSubjects,
    addSubject,
    deleteSubject,
    updateSubjectName,
    addTopic,
    toggleTopicComplete,
    deleteTopic,
    updateTopic,
  };

  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>;
};

// ─── Custom Hook ───────────────────────────────────────────────────────────────

export const useStudy = (): StudyContextType => {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudy must be used inside a <StudyProvider>');
  }
  return context;
};
