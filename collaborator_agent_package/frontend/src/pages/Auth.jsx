import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import BackgroundEffects from "../components/BackgroundEffects";
import "../styles/auth.css";

// Fallback logo if the asset is missing
const logo = "https://via.placeholder.com/150?text=Collaborator";

export default function Auth() {
  const { login, signup, continueWithGoogle, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine initial mode based on path
  const [isLogin, setIsLogin] = useState(location.pathname === "/login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    setIsLogin(location.pathname === "/login");
    setError("");
  }, [location.pathname]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await signup(formData);
        // If signup is successful, we might need to show OTP or just redirect 
        // depending on the backend. The backend I saw earlier sets isVerified: true for now.
        // So we might need to login immediately or redirect.
        // Assuming signup logs them in or they should redirect to login.
        setIsLogin(true);
        setError("Account created! Please login.");
      }
    } catch (err) {
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsSubmitting(true);
      setError("");
      await continueWithGoogle(credentialResponse.credential);
      navigate("/");
    } catch (err) {
      setError(err.message || "Google Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google Login was unsuccessful. Try again later.");
  };

  if (loading) return <div className="auth-loading-container"><div className="auth-loading-card">Loading...</div></div>;

  return (
    <div className="auth-container">
      <BackgroundEffects />
      <div className="auth-glow"></div>

      <div className="auth-top">
        <button onClick={() => navigate("/")} className="auth-back-btn">
          ← Back
        </button>
      </div>

      <div className="auth-logo-wrap">
        <img src={logo} alt="Collaborator" className="auth-logo" />
        <h1 className="auth-title">
          {isLogin ? "Welcome Back" : "Join Collaborator"}
        </h1>
      </div>

      <div className="auth-card">
        {error && <div className="auth-error-msg">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form-full">
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="auth-input"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="auth-input"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="auth-input"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button 
            type="submit" 
            className="btn-primary auth-btn" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : (isLogin ? "Login" : "Sign Up")}
          </button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <div className="auth-google-wrap">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
            theme="filled_black"
            shape="pill"
            width="320"
          />
        </div>

        <div className="auth-switch">
          {isLogin ? (
            <p>
              Don't have an account?{" "}
              <span onClick={() => navigate("/signup")}>Create one</span>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <span onClick={() => navigate("/login")}>Login here</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
