export default function LoadingSpinner({ size = 40, text = "Loading..." }) {
  return (
    <>
      <div className="loading-spinner-wrapper">
        <div className="loading-spinner" style={{ width: size, height: size }} />
        {text && <p className="loading-text">{text}</p>}
      </div>

      <style>{`
        .loading-spinner-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          gap: 16px;
        }
        .loading-spinner {
          border: 3px solid var(--gray-200);
          border-top-color: var(--coral);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        .loading-text {
          color: var(--gray-500);
          font-size: 0.9rem;
        }
      `}</style>
    </>
  );
}
