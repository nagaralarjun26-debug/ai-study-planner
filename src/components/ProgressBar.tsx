// ProgressBar: Visual progress indicator for a subject or overall progress
// Accepts a percentage (0-100) and renders an animated fill bar


interface ProgressBarProps {
  percentage: number;       // 0 to 100
  label?: string;           // Optional label above the bar
  showPercent?: boolean;    // Whether to show "XX%" text
  color?: 'blue' | 'green' | 'purple' | 'orange';
}

const ProgressBar = ({
  percentage,
  label,
  showPercent = true,
  color = 'blue',
}: ProgressBarProps) => {
  // Clamp value between 0 and 100
  const safePercent = Math.min(100, Math.max(0, percentage));

  return (
    <div className="progress-bar-wrapper">
      {(label || showPercent) && (
        <div className="progress-bar-header">
          {label && <span className="progress-bar-label">{label}</span>}
          {showPercent && (
            <span className="progress-bar-percent">{safePercent}%</span>
          )}
        </div>
      )}
      <div className="progress-bar-track" role="progressbar" aria-valuenow={safePercent} aria-valuemin={0} aria-valuemax={100}>
        <div
          className={`progress-bar-fill progress-fill-${color}`}
          style={{ width: `${safePercent}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
