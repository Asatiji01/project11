import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginAPI } from "../../utils/ApiRequest";
import * as Components from "./Components";
import { Link } from "react-router-dom";
import "./styles.css";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [signIn, setSignIn] = useState(true);
  const [values, setValues] = useState({ email: "", password: "" });
  const [showOverlay, setShowOverlay] = useState(false); // Added for submit overlay

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);

  const toggle = (state) => {
    setSignIn(state);
  };

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = values;
    setLoading(true);

    try {
      const { data } = await axios.post(loginAPI, { email, password });

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
        toast.success(data.message, toastOptions);
      } else {
        toast.error(data.message, toastOptions);
      }
    } catch (error) {
      toast.error("Login failed. Please try again.", toastOptions);
    }
    setLoading(false);
  };

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    setShowOverlay(true); // Show overlay on submit
  };

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: { value: "#000" } },
          fpsLimit: 60,
          particles: {
            number: { value: 200, density: { enable: true, value_area: 800 } },
            color: { value: "#ffcc00" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: { enable: true, minimumValue: 1 } },
            move: { enable: true, speed: 2 },
          },
          detectRetina: true,
        }}
        style={{ position: "absolute", zIndex: -1, top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <Components.Container style={{ position: "relative", top: "10vh", left: "25vw", right: "20vw", bottom: "10vh", width: "50vw", height: "80vh",  color:"black"}}>
        
        {/* Feedback Form */}
        <Components.SignUpContainer signingIn={signIn} style={{color:"black"}}>
          <Components.Form onSubmit={handleSubmitFeedback}>
            <Components.Title>THE EXPENSE TRACKER</Components.Title>
            <Components.Input type="text" placeholder="Feedback" required />
            <Components.Input type="text" placeholder="Full Name" required />
            <Components.Input type="text" placeholder="Phone Number" required />
            <Components.Button type="submit">Submit</Components.Button>
          </Components.Form>

          {/* Submit Confirmation Overlay */}
          {showOverlay && (
            <div className="submit-overlay">
              <div className="submit-btn-overlay">
                <div className="submit-btn-header">
                  <h2>Submitted</h2>
                </div>
                <div className="submit-btn-content">
                  <p>Thank you for your feedback. It was submitted successfully.</p>
                  <p>The feedback submission date: <span className="date">{new Date().toLocaleDateString()}</span></p>
                </div>
                <Components.Button className="submit-close-btn" onClick={() => setShowOverlay(false)}>x</Components.Button>
              </div>
            </div>
          )}
        </Components.SignUpContainer>

        {/* Login Form */}
        <Components.SignInContainer signingIn={signIn}>
          <Components.Form onSubmit={handleSubmit}>
            <Components.Title>Sign in</Components.Title>
            <Components.Input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <Components.Input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <Components.Anchor href="#">Forgot your password?</Components.Anchor>
            <Components.Button type="submit" disabled={loading}>{loading ? "Signing In..." : "Sign In"}</Components.Button>
          </Components.Form>
        </Components.SignInContainer>

        <Components.OverlayContainer signingIn={signIn}>
          <Components.Overlay signingIn={signIn}>
            <Components.LeftOverlayPanel signingIn={signIn}>
              <Components.Title>Welcome Back!</Components.Title>
              <Components.Paragraph>To keep connected with us, please log in with your personal info.</Components.Paragraph>
              <Components.GhostButton onClick={() => toggle(true)}>Sign In</Components.GhostButton>
            </Components.LeftOverlayPanel>
            <Components.RightOverlayPanel signingIn={signIn}>
              <Components.Title>Hello, Friend!</Components.Title>
              <Components.Paragraph>Enter your personal details and start your journey with us.</Components.Paragraph>
              <Components.GhostButton onClick={() => toggle(false)}>
                <p className="mt-3" style={{ color: "#9d9494" }}>
                  Don't Have an Account? <Link to="/register" className="text-black lnk">Register</Link>
                </p>About
              </Components.GhostButton>
            </Components.RightOverlayPanel>
          </Components.Overlay>
        </Components.OverlayContainer>
      </Components.Container>

      <ToastContainer />
    </div>
  );
};

export default Login;
