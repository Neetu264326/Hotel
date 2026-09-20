import { useToast } from "../context/ToastContext";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const colors = {
  success: { bg: "rgba(34, 197, 94, 0.1)", border: "rgba(34, 197, 94, 0.2)", text: "#16a34a" },
  error: { bg: "rgba(239, 68, 68, 0.1)", border: "rgba(239, 68, 68, 0.2)", text: "#dc2626" },
  info: { bg: "rgba(59, 130, 246, 0.1)", border: "rgba(59, 130, 246, 0.2)", text: "#2563eb" },
};

export default function Toast() {
  const { toasts, removeToast } = useToast();

  return (
    <>
      <div className="toast-container" aria-live="polite">
        {toasts.map((toast) => {
          const Icon = icons[toast.type] || icons.info;
          const color = colors[toast.type] || colors.info;
          return (
            <div
              key={toast.id}
              className="toast"
              style={{
                background: color.bg,
                borderColor: color.border,
                color: color.text,
              }}
            >
              <Icon size={18} />
              <span>{toast.message}</span>
              <button
                className="toast-close"
                onClick={() => removeToast(toast.id)}
                aria-label="Dismiss"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>

      <style>{`
        .toast-container {
          position: fixed;
          top: 80px;
          right: 20px;
          z-index: 3000;
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-width: 360px;
        }
        .toast {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: var(--radius-md);
          border: 1px solid;
          font-size: 0.9rem;
          font-weight: 500;
          animation: slideInRight 0.3s ease;
          backdrop-filter: blur(10px);
        }
        .toast-close {
          margin-left: auto;
          background: none;
          color: inherit;
          opacity: 0.6;
          cursor: pointer;
          padding: 2px;
        }
        .toast-close:hover {
          opacity: 1;
        }
        @media (max-width: 480px) {
          .toast-container {
            right: 12px;
            left: 12px;
            max-width: none;
          }
        }
      `}</style>
    </>
  );
}
