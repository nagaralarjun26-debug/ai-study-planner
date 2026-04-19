// Spinner: Simple loading indicator used during async operations


interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

const Spinner = ({ size = 'md', message }: SpinnerProps) => {
  return (
    <div className={`spinner-wrapper spinner-${size}`}>
      <div className="spinner" role="status" aria-label="Loading" />
      {message && <p className="spinner-message">{message}</p>}
    </div>
  );
};

export default Spinner;
