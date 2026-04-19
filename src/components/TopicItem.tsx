// TopicItem: Renders a single topic row with complete toggle, edit, and delete actions

import { useState, useRef } from 'react';
import type { Topic } from '../services/firestoreService';
import { useStudy } from '../context/StudyContext';
import { deadlineLabel, formatDate } from '../utils/dateUtils';

interface TopicItemProps {
  topic: Topic;
  subjectId: string;
}

const TopicItem = ({ topic, subjectId }: TopicItemProps) => {
  const { toggleTopicComplete, deleteTopic, updateTopic } = useStudy();

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(topic.title);
  const [editDeadline, setEditDeadline] = useState(topic.deadline);
  const [saving, setSaving] = useState(false);

  // useRef: focus the input when edit mode opens
  const titleInputRef = useRef<HTMLInputElement>(null);

  const { text: deadlineText, status: deadlineStatus } = deadlineLabel(topic.deadline);

  // Toggle completed status
  const handleToggle = async () => {
    await toggleTopicComplete(subjectId, topic.id, topic.completed);
  };

  // Delete topic
  const handleDelete = async () => {
    if (!window.confirm(`Delete topic "${topic.title}"?`)) return;
    await deleteTopic(subjectId, topic.id);
  };

  // Open edit mode and focus input
  const handleEditOpen = () => {
    setEditTitle(topic.title);
    setEditDeadline(topic.deadline);
    setIsEditing(true);
    // Focus after state update
    setTimeout(() => titleInputRef.current?.focus(), 0);
  };

  // Save edits to Firestore
  const handleEditSave = async () => {
    if (!editTitle.trim()) return;
    setSaving(true);
    await updateTopic(subjectId, topic.id, {
      title: editTitle.trim(),
      deadline: editDeadline,
    });
    setSaving(false);
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditTitle(topic.title);
    setEditDeadline(topic.deadline);
  };

  // ── Edit Mode UI ────────────────────────────────────────────────────────────
  if (isEditing) {
    return (
      <li className="topic-item topic-item--editing">
        <div className="topic-edit-fields">
          <input
            ref={titleInputRef}
            id={`edit-title-${topic.id}`}
            className="input"
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Topic title"
          />
          <input
            id={`edit-deadline-${topic.id}`}
            className="input"
            type="date"
            value={editDeadline}
            onChange={(e) => setEditDeadline(e.target.value)}
          />
        </div>
        <div className="topic-edit-actions">
          <button
            className="btn btn-primary btn-sm"
            onClick={handleEditSave}
            disabled={saving || !editTitle.trim()}
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
          <button className="btn btn-ghost btn-sm" onClick={handleEditCancel}>
            Cancel
          </button>
        </div>
      </li>
    );
  }

  // ── Normal View UI ──────────────────────────────────────────────────────────
  return (
    <li className={`topic-item ${topic.completed ? 'topic-item--done' : ''}`}>
      <div className="topic-main">
        {/* Controlled checkbox — marks topic complete/incomplete */}
        <input
          id={`topic-checkbox-${topic.id}`}
          className="topic-checkbox"
          type="checkbox"
          checked={topic.completed}
          onChange={handleToggle}
          aria-label={`Mark "${topic.title}" as ${topic.completed ? 'incomplete' : 'complete'}`}
        />
        <label htmlFor={`topic-checkbox-${topic.id}`} className="topic-title">
          {topic.title}
        </label>
      </div>

      <div className="topic-meta">
        {topic.deadline && (
          <span className={`deadline-badge deadline-${deadlineStatus}`} title={formatDate(topic.deadline)}>
            📅 {deadlineText}
          </span>
        )}
        <button
          id={`edit-topic-${topic.id}`}
          className="btn-icon"
          onClick={handleEditOpen}
          title="Edit topic"
          aria-label="Edit topic"
        >
          ✏️
        </button>
        <button
          id={`delete-topic-${topic.id}`}
          className="btn-icon btn-icon--danger"
          onClick={handleDelete}
          title="Delete topic"
          aria-label="Delete topic"
        >
          🗑️
        </button>
      </div>
    </li>
  );
};

export default TopicItem;
