import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const result = login(email.trim(), password);
      setLoading(false);
      if (result.success) {
        addToast("Logged in successfully!", "success");
        navigate(from, { replace: true });
      } else {
        setError(result.error);
      }
    }, 500);
  };

  return (
    <div className="page-wrapper">
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-icon">
            <LogIn size={32} />
          </div>
          <h1>Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your FoodDash account</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="input-icon-wrap">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-icon-wrap">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block btn-lg"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>

      <style>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 120px 20px 60px;
        }
        .auth-card {
          width: 100%;
          max-width: 420px;
          background: var(--white);
          border-radius: var(--radius-xl);
          padding: 40px;
          box-shadow: var(--shadow-xl);
          border: 1px solid var(--gray-100);
          animation: fadeIn 0.4s ease;
        }
        .auth-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--coral), var(--golden));
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin: 0 auto 20px;
        }
        .auth-card h1 {
          text-align: center;
          color: var(--navy);
          margin-bottom: 6px;
          font-size: 1.6rem;
        }
        .auth-subtitle {
          text-align: center;
          color: var(--gray-500);
          margin-bottom: 28px;
          font-size: 0.95rem;
        }
        .auth-error {
          background: rgba(239, 68, 68, 0.1);
          color: var(--red);
          padding: 10px 14px;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          margin-bottom: 16px;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }
        .form-group {
          margin-bottom: 18px;
        }
        .form-label {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--gray-700);
          margin-bottom: 6px;
        }
        .input-icon-wrap {
          position: relative;
        }
        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--gray-400);
        }
        .input-icon-wrap .form-input {
          padding-left: 42px;
          padding-right: 42px;
        }
        .toggle-password {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          color: var(--gray-400);
          cursor: pointer;
          padding: 4px;
          display: flex;
        }
        .toggle-password:hover {
          color: var(--gray-600);
        }
        .form-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid var(--gray-200);
          border-radius: var(--radius-md);
          font-size: 0.95rem;
          transition: all var(--transition-fast);
          background: var(--white);
        }
        .form-input:focus {
          outline: none;
          border-color: var(--coral);
          box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
        }
        .auth-switch {
          text-align: center;
          margin-top: 24px;
          color: var(--gray-500);
          font-size: 0.9rem;
        }
        .auth-switch a {
          color: var(--coral);
          font-weight: 600;
          text-decoration: none;
        }
        .auth-switch a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
