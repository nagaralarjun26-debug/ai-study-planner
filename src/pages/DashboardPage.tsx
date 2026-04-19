// DashboardPage: Main screen after login
// Shows: welcome message, overall progress, smart suggestions, and all subject cards

import React, { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStudy } from '../context/StudyContext';
import Navbar from '../components/Navbar';
import SubjectCard from '../components/SubjectCard';
import AddSubjectForm from '../components/AddSubjectForm';
import SuggestionCard from '../components/SuggestionCard';
import ProgressBar from '../components/ProgressBar';
import Spinner from '../components/Spinner';
import useProgress from '../hooks/useProgress';
import { getSuggestions } from '../utils/suggestions';

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const { subjects, loadingData } = useStudy();

  // useMemo: derive progress stats from subjects — avoids recalc on unrelated renders
  const progress = useProgress(subjects);

  // useMemo: compute smart suggestions only when subjects change
  const suggestions = useMemo(() => getSuggestions(subjects), [subjects]);

  // Friendly first name from email (e.g. "john.doe@..." → "John")
  const firstName = currentUser?.email?.split('@')[0]?.split(/[._]/)[0] ?? 'Student';
  const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

  // ── Loading State ───────────────────────────────────────────────────────────
  if (loadingData) {
    return (
      <>
        <Navbar />
        <main className="dashboard-page">
          <Spinner size="lg" message="Loading your study plan…" />
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="dashboard-page">
        {/* ── Welcome Banner ─────────────────────────────────────────────── */}
        <section className="welcome-banner">
          <div className="welcome-text">
            <h1 className="welcome-title">
              Welcome back, {displayName}! 👋
            </h1>
            <p className="welcome-subtitle">
              {subjects.length === 0
                ? "You haven't added any subjects yet. Start by adding one below!"
                : `You're tracking ${subjects.length} subject${subjects.length > 1 ? 's' : ''} with ${progress.totalTopics} topics.`}
            </p>
          </div>
        </section>

        {/* ── Overall Progress ───────────────────────────────────────────── */}
        {progress.totalTopics > 0 && (
          <section className="section overall-progress">
            <h2 className="section-title">📊 Overall Progress</h2>
            <div className="progress-overview-card">
              <div className="progress-stats">
                <div className="stat-item">
                  <span className="stat-number">{progress.totalCompleted}</span>
                  <span className="stat-label">Completed</span>
                </div>
                <div className="stat-divider" />
                <div className="stat-item">
                  <span className="stat-number">{progress.totalTopics - progress.totalCompleted}</span>
                  <span className="stat-label">Remaining</span>
                </div>
                <div className="stat-divider" />
                <div className="stat-item">
                  <span className="stat-number stat-percent">{progress.overallPercentage}%</span>
                  <span className="stat-label">Done</span>
                </div>
              </div>
              <ProgressBar
                percentage={progress.overallPercentage}
                color={progress.overallPercentage >= 80 ? 'green' : progress.overallPercentage >= 40 ? 'blue' : 'orange'}
              />
            </div>
          </section>
        )}

        {/* ── Smart Suggestions ──────────────────────────────────────────── */}
        <section className="section suggestions-section">
          <h2 className="section-title">🤖 Smart Suggestions</h2>
          <div className="suggestions-list">
            {suggestions.map((s) => (
              // key = suggestion.id for React list reconciliation
              <SuggestionCard key={s.id} suggestion={s} />
            ))}
          </div>
        </section>

        {/* ── Subjects Section ───────────────────────────────────────────── */}
        <section className="section subjects-section">
          <div className="section-header">
            <h2 className="section-title">📚 My Subjects</h2>
            {/* Add Subject Form (toggle-based) */}
            <AddSubjectForm />
          </div>

          {subjects.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📖</span>
              <p className="empty-text">No subjects added yet.</p>
              <p className="empty-subtext">Click "+ Add Subject" to get started!</p>
            </div>
          ) : (
            <div className="subjects-grid">
              {/* Render a SubjectCard for each subject — key = subject.id */}
              {subjects.map((subject) => {
                // Find the derived progress for this subject
                const sp = progress.subjectProgress.find(
                  (p) => p.subjectId === subject.id
                );
                return (
                  <SubjectCard
                    key={subject.id}
                    subject={subject}
                    completedCount={sp?.completed ?? 0}
                    totalCount={sp?.total ?? 0}
                    percentage={sp?.percentage ?? 0}
                  />
                );
              })}
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default DashboardPage;
