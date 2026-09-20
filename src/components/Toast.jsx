import { CheckCircle2, XCircle, Info } from 'lucide-react'

const Toast = ({ toasts, removeToast }) => {
  return (
    <div className="toast-container" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast-${toast.type}`}
          role="alert"
        >
          {toast.type === 'success' && <CheckCircle2 size={22} color="#22C55E" />}
          {toast.type === 'error' && <XCircle size={22} color="#EF4444" />}
          {toast.type === 'info' && <Info size={22} color="#FF6B35" />}
          <span>{toast.message}</span>
          <button
            className="toast-close"
            onClick={() => removeToast(toast.id)}
            aria-label="Dismiss notification"
            style={{ marginLeft: 'auto', color: '#9CA3AF', flexShrink: 0 }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}

export default Toast
