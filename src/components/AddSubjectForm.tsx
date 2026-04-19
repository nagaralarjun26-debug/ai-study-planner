// AddSubjectForm: Controlled form to add a new subject
// Lifted state: onAdd callback lifts the new subject name up to the parent

import { useState, type FormEvent } from 'react';
import { useStudy } from '../context/StudyContext';

const AddSubjectForm = () => {
  const { addSubject } = useStudy();

  // Controlled form state
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Subject name cannot be empty.');
      return;
    }

    setLoading(true);
    try {
      await addSubject(name.trim());
      setName(''); // Reset controlled input after success
      setShowForm(false);
    } catch (err) {
      setError('Failed to add subject. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) {
    return (
      <button
        id="add-subject-btn"
        className="btn btn-primary add-subject-trigger"
        onClick={() => setShowForm(true)}
      >
        + Add Subject
      </button>
    );
  }

  return (
    <div className="add-subject-form-card">
      <h3 className="form-title">New Subject</h3>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="subject-name-input" className="form-label">
            Subject Name
          </label>
          {/* Controlled input — value bound to state */}
          <input
            id="subject-name-input"
            className="input"
            type="text"
            placeholder='e.g. DSA, DBMS, Operating Systems'
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            autoFocus
            maxLength={60}
          />
        </div>

        {error && <p className="form-error">{error}</p>}

        <div className="form-actions">
          <button
            id="submit-subject-btn"
            className="btn btn-primary"
            type="submit"
            disabled={loading || !name.trim()}
          >
            {loading ? 'Adding…' : 'Add Subject'}
          </button>
          <button
            className="btn btn-ghost"
            type="button"
            onClick={() => { setShowForm(false); setName(''); setError(''); }}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSubjectForm;
