// Firestore CRUD operations for subjects and topics
// All operations are scoped to the currently logged-in user (userId)

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  serverTimestamp,
  orderBy,
} from 'firebase/firestore';
import type { Timestamp } from 'firebase/firestore';
import { db } from './firebase';

// ─── Type Definitions ──────────────────────────────────────────────────────────

export interface Topic {
  id: string;
  title: string;
  completed: boolean;
  deadline: string; // ISO date string e.g. "2024-06-01"
}

export interface Subject {
  id: string;
  name: string;
  createdAt: Timestamp | null;
  userId: string;
  topics: Topic[];
}

// ─── Subjects ──────────────────────────────────────────────────────────────────

/**
 * Add a new subject for the given user.
 */
export const addSubject = async (name: string, userId: string): Promise<string> => {
  const docRef = await addDoc(collection(db, 'users', userId, 'subjects'), {
    name,
    userId,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

/**
 * Fetch all subjects belonging to a user, ordered by creation time.
 */
export const getSubjects = async (userId: string): Promise<Subject[]> => {
  const q = query(
    collection(db, 'users', userId, 'subjects'),
    orderBy('createdAt', 'asc')
  );
  const snapshot = await getDocs(q);

  // For each subject, also fetch its topics
  const subjects: Subject[] = [];
  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    const topics = await getTopics(userId, docSnap.id);
    subjects.push({
      id: docSnap.id,
      name: data.name,
      createdAt: data.createdAt,
      userId: data.userId,
      topics,
    });
  }
  return subjects;
};

/**
 * Delete a subject (and all its topics) by subject ID.
 */
export const deleteSubject = async (userId: string, subjectId: string): Promise<void> => {
  // First delete all topics under this subject
  const topicsSnapshot = await getDocs(
    collection(db, 'users', userId, 'subjects', subjectId, 'topics')
  );
  const deletePromises = topicsSnapshot.docs.map((t) => deleteDoc(t.ref));
  await Promise.all(deletePromises);

  // Then delete the subject document itself
  await deleteDoc(doc(db, 'users', userId, 'subjects', subjectId));
};

/**
 * Update a subject's name.
 */
export const updateSubjectName = async (
  userId: string,
  subjectId: string,
  newName: string
): Promise<void> => {
  await updateDoc(doc(db, 'users', userId, 'subjects', subjectId), { name: newName });
};

// ─── Topics ────────────────────────────────────────────────────────────────────

/**
 * Add a new topic under a subject.
 */
export const addTopic = async (
  userId: string,
  subjectId: string,
  title: string,
  deadline: string
): Promise<string> => {
  const docRef = await addDoc(
    collection(db, 'users', userId, 'subjects', subjectId, 'topics'),
    {
      title,
      completed: false,
      deadline,
    }
  );
  return docRef.id;
};

/**
 * Fetch all topics under a subject.
 */
export const getTopics = async (userId: string, subjectId: string): Promise<Topic[]> => {
  const snapshot = await getDocs(
    collection(db, 'users', userId, 'subjects', subjectId, 'topics')
  );
  return snapshot.docs.map((d) => ({
    id: d.id,
    title: d.data().title,
    completed: d.data().completed,
    deadline: d.data().deadline,
  }));
};

/**
 * Toggle the completion status of a topic.
 */
export const toggleTopicComplete = async (
  userId: string,
  subjectId: string,
  topicId: string,
  currentStatus: boolean
): Promise<void> => {
  await updateDoc(
    doc(db, 'users', userId, 'subjects', subjectId, 'topics', topicId),
    { completed: !currentStatus }
  );
};

/**
 * Delete a specific topic.
 */
export const deleteTopic = async (
  userId: string,
  subjectId: string,
  topicId: string
): Promise<void> => {
  await deleteDoc(doc(db, 'users', userId, 'subjects', subjectId, 'topics', topicId));
};

/**
 * Update a topic's title and/or deadline.
 */
export const updateTopic = async (
  userId: string,
  subjectId: string,
  topicId: string,
  updates: Partial<Pick<Topic, 'title' | 'deadline'>>
): Promise<void> => {
  await updateDoc(
    doc(db, 'users', userId, 'subjects', subjectId, 'topics', topicId),
    updates
  );
};
