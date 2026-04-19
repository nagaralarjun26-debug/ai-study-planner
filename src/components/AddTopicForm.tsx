// AddTopicForm: Controlled form to add a new topic under a subject
// Demonstrates: useState, controlled inputs, form submission

import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { todayStr } from '../utils/dateUtils';

interface AddTopicFormProps {
  subjectId: string;
  onClose: () => void;   // Callback to close the form after adding
}

const AddTopicForm = ({ subjectId, onClose }: AddTopicFormProps) => {
  const { addTopic } = useStudy();

  // Controlled form state
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!title.trim()) {
      setError('Topic title is required.');
      return;
    }

    setLoading(true);
    try {
      await addTopic(subjectId, title.trim(), deadline);
      // Reset form and close
      setTitle('');
      setDeadline('');
      onClose();
    } catch (err) {
      setError('Failed to add topic. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="add-topic-form" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        {/* Controlled input — title */}
        <input
          id={`topic-title-input-${subjectId}`}
          className="input"
          type="text"
          placeholder="Topic title (e.g. Arrays, SQL Joins)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
          maxLength={100}
        />

        {/* Controlled input — deadline */}
        <input
          id={`topic-deadline-input-${subjectId}`}
          className="input input--date"
          type="date"
          value={deadline}
          min={todayStr()}
          onChange={(e) => setDeadline(e.target.value)}
          disabled={loading}
        />
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button
          id={`add-topic-submit-${subjectId}`}
          className="btn btn-primary btn-sm"
          type="submit"
          disabled={loading || !title.trim()}
        >
          {loading ? 'Adding…' : '+ Add Topic'}
        </button>
        <button
          className="btn btn-ghost btn-sm"
          type="button"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddTopicForm;
