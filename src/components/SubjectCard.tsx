// SubjectCard: Full card for a subject showing its topics and progress
// Includes expand/collapse, add topic form, and delete subject action

import { useState, useCallback } from 'react';
import type { Subject } from '../services/firestoreService';
import { useStudy } from '../context/StudyContext';
import TopicItem from './TopicItem';
import AddTopicForm from './AddTopicForm';
import ProgressBar from './ProgressBar';

interface SubjectCardProps {
  subject: Subject;
  completedCount: number;
  totalCount: number;
  percentage: number;
}

const SubjectCard = ({ subject, completedCount, totalCount, percentage }: SubjectCardProps) => {
  const { deleteSubject, updateSubjectName } = useStudy();

  // UI state
  const [expanded, setExpanded] = useState(false);
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState(subject.name);
  const [savingName, setSavingName] = useState(false);

  // Toggle expand/collapse — useCallback to avoid re-creating on each render
  const toggleExpand = useCallback(() => {
    setExpanded((prev) => !prev);
    setShowAddTopic(false); // Close topic form when collapsing
  }, []);

  const handleDeleteSubject = async () => {
    if (!window.confirm(`Delete subject "${subject.name}" and all its topics?`)) return;
    await deleteSubject(subject.id);
  };

  const handleSaveName = async () => {
    if (!editNameValue.trim()) return;
    setSavingName(true);
    await updateSubjectName(subject.id, editNameValue.trim());
    setSavingName(false);
    setIsEditingName(false);
  };

  // Color for progress bar depending on completion %
  const barColor = percentage >= 80 ? 'green' : percentage >= 40 ? 'blue' : 'orange';

  return (
    <div className="subject-card">
      {/* ── Card Header ──────────────────────────────────────────────── */}
      <div className="subject-card-header">
        <div className="subject-name-area">
          {isEditingName ? (
            <div className="subject-name-edit">
              <input
                id={`edit-subject-${subject.id}`}
                className="input input--sm"
                value={editNameValue}
                onChange={(e) => setEditNameValue(e.target.value)}
                autoFocus
              />
              <button
                className="btn btn-primary btn-sm"
                onClick={handleSaveName}
                disabled={savingName || !editNameValue.trim()}
              >
                {savingName ? '…' : 'Save'}
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => { setIsEditingName(false); setEditNameValue(subject.name); }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="subject-title-row">
              <h3 className="subject-name" onClick={toggleExpand}>
                {subject.name}
              </h3>
              <button
                id={`edit-subject-name-${subject.id}`}
                className="btn-icon"
                onClick={() => setIsEditingName(true)}
                title="Edit subject name"
              >
                ✏️
              </button>
            </div>
          )}

          <span className="topic-count">
            {completedCount}/{totalCount} topics done
          </span>
        </div>

        <div className="subject-card-actions">
          {/* Expand/Collapse toggle */}
          <button
            id={`expand-subject-${subject.id}`}
            className="btn btn-ghost btn-sm"
            onClick={toggleExpand}
            aria-expanded={expanded}
            aria-controls={`subject-topics-${subject.id}`}
          >
            {expanded ? '▲ Collapse' : '▼ Topics'}
          </button>
          <button
            id={`delete-subject-${subject.id}`}
            className="btn btn-danger btn-sm"
            onClick={handleDeleteSubject}
            title="Delete subject"
          >
            Delete
          </button>
        </div>
      </div>

      {/* ── Progress Bar ───────────────────────────────────────────────── */}
      <div className="subject-progress">
        <ProgressBar percentage={percentage} color={barColor} />
      </div>

      {/* ── Expanded: Topics List + Add Form ───────────────────────────── */}
      {expanded && (
        <div id={`subject-topics-${subject.id}`} className="subject-topics">
          {/* Topic list — each item gets a unique key */}
          {subject.topics.length === 0 ? (
            <p className="no-topics-msg">No topics yet. Add your first topic below!</p>
          ) : (
            <ul className="topic-list">
              {subject.topics.map((topic) => (
                <TopicItem
                  key={topic.id}   // key = unique id for React reconciliation
                  topic={topic}
                  subjectId={subject.id}
                />
              ))}
            </ul>
          )}

          {/* Add topic toggle */}
          {showAddTopic ? (
            <AddTopicForm
              subjectId={subject.id}
              onClose={() => setShowAddTopic(false)}
            />
          ) : (
            <button
              id={`add-topic-btn-${subject.id}`}
              className="btn btn-outline btn-sm add-topic-trigger"
              onClick={() => setShowAddTopic(true)}
            >
              + Add Topic
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SubjectCard;
