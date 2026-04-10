import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";

export default function ProtectedRoute({ children }) {
  const { user, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return children;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 600));
    const ok = login(email, password);
    if (!ok) setError("Incorrect email or password.");
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--gray-50)",
        padding: "40px 24px",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "var(--radius-lg)",
          padding: "48px 40px",
          width: "100%",
          maxWidth: 420,
          boxShadow: "var(--shadow-xl)",
          border: "1px solid var(--gray-200)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div
            style={{
              width: 56,
              height: 56,
              background: "var(--blue-50)",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <FiLock size={24} color="var(--blue-600)" />
          </div>
          <h2 style={{ fontSize: "1.5rem", marginBottom: 6 }}>Admin Area</h2>
          <p style={{ fontSize: 14, color: "var(--gray-600)" }}>
            Sign in to access the dashboard
          </p>
        </div>

        <div
          style={{
            background: "var(--blue-50)",
            border: "1px solid var(--blue-200)",
            borderRadius: 10,
            padding: "12px 16px",
            marginBottom: 24,
            fontSize: 13,
            color: "var(--blue-800)",
          }}
        >
          <strong>Demo access:</strong>
          <br />
          Email: <code>admin@travelmundo.tn</code>
          <br />
          Password: <code>admin123</code>
        </div>

        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: 18 }}
        >
          <div>
            <label className="label">Email address</label>
            <input
              type="email"
              className="input-field"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPwd ? "text" : "password"}
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--gray-500)",
                }}
              >
                {showPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div
              style={{
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                borderRadius: 8,
                padding: "10px 14px",
                color: "#991B1B",
                fontSize: 13,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: "100%", justifyContent: "center", marginTop: 4 }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
