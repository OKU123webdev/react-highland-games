import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/App.css";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// pages
import Homepage from "./pages/Home";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import News from "./pages/News";
import Compete from "./pages/Compete";
import Success from "./pages/Success";
import NewEvent from "./pages/NewEvent";
import UserCompete from "./pages/UserCompete";
import UserCompeteNav from "./pages/UserCompeteNav";
import UserSuccess from "./pages/UserSuccess";

// components
import ScrollToTop from "./ScrollToTop";
import UserSync from "./components/UserSync";
import AdminRoute from "./components/AdminRoute";

// auth0
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* redirect new auth0 users to the success screen */
function SignupRedirect() {
  const { isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // prevent multiple redirects
    if (hasChecked) return;

    const flag = localStorage.getItem("newUserSignUp");
    const pending = localStorage.getItem("pendingRegistration");

    console.log("SignupRedirect check:", {
      isAuthenticated: isAuthenticated,
      isLoading: isLoading,
      flag: flag,
      hasPending: !!pending,
      hasChecked: hasChecked
    });

    // if pending data, wait for authentication
    if (flag === "true" && pending) {

      // if authenticated, redirect
      if (isAuthenticated && !isLoading) {
        console.log("Redirecting to user-success page NOW");

        setHasChecked(true);
        localStorage.setItem("userLoggedInRegistration", pending);
        localStorage.removeItem("pendingRegistration");
        localStorage.removeItem("newUserSignUp");

        setTimeout(() => {
          navigate("/user-success", { replace: true });
        }, 0);
      }

      // check authentication
      else if (!isLoading && !isAuthenticated) {
        localStorage.removeItem("newUserSignUp");
        localStorage.removeItem("pendingRegistration");
        setHasChecked(true);
      }
    }
  }, [isAuthenticated, isLoading, navigate, hasChecked]);

  // missed redirect
  useEffect(() => {
    const timer = setTimeout(() => {
      const flag = localStorage.getItem("newUserSignUp");
      const pending = localStorage.getItem("pendingRegistration");

      console.log("Backup timer check:", {
        isAuthenticated,
        flag,
        hasPending: !!pending,
        hasChecked
      });

      if (isAuthenticated && flag === "true" && pending && !hasChecked) {
        console.log("Backup redirect triggered - forcing navigation");
        setHasChecked(true);
        localStorage.setItem("userLoggedInRegistration", pending);
        localStorage.removeItem("pendingRegistration");
        localStorage.removeItem("newUserSignUp");
        navigate("/user-success", { replace: true });
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate, hasChecked]);

  return null;
}

// NAVIGATION BAR
function Navigation() {
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();
  const [userRole, setUserRole] = useState(null);

  // check user role
  useEffect(() => {
    const checkUserRole = async () => {
      if (isAuthenticated && user) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/users/role?auth0Id=${user.sub}`
          );
          const data = await response.json();
          setUserRole(data.role);
        } catch (error) {
          console.error("role fetch error:", error);
          setUserRole("participant");
        }
      } else {
        setUserRole(null);
      }
    };

    checkUserRole();
  }, [isAuthenticated, user]);

  // render navigation
  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top">
      <div className="container">

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">

          {/* left links */}
          <div className="navbar-nav">

            <Link className="nav-link" to="/">Home</Link>
            <Link className="nav-link" to="/events">Events</Link>
            <Link className="nav-link" to="/news">News</Link>

            <Link
              className="nav-link"
              to={isAuthenticated ? "/user-compete-nav" : "/compete"}
            >
              Compete
            </Link>

            {/* admin create event */}
            {isAuthenticated && userRole === "admin" && (
              <Link className="nav-link" to="/new-event">
                Create Event
              </Link>
            )}

          </div>

          {/* right login/logout */}
          <div className="navbar-nav ms-auto">
            {isAuthenticated ? (
              <>
                <span className="navbar-text" style={{ textTransform: "capitalize" }}>
                  welcome, {user?.nickname}
                </span>

                <a
                  className="nav-link"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    logout({ returnTo: window.location.origin });
                  }}
                >
                  logout
                </a>
              </>
            ) : (
              <a
                className="nav-link"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  loginWithRedirect();
                }}
              >
                login
              </a>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}

// MAIN APP
function App() {
  return (
    <Router>
      <ScrollToTop />

      <div id="page-container">
        <Navigation />
        <UserSync />
        <SignupRedirect />

        <main>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/events" element={<Events />} />
            <Route path="/event/:id" element={<EventDetails />} />
            <Route path="/news" element={<News />} />

            {/* guest compete */}
            <Route path="/compete" element={<Compete />} />

            {/* user logged-in */}
            <Route path="/user-compete" element={<UserCompete />} />
            <Route path="/user-compete-nav" element={<UserCompeteNav />} />

            {/* success pages */}
            <Route path="/success" element={<Success />} />
            <Route path="/user-success" element={<UserSuccess />} />

            {/* admin route */}
            <Route
              path="/new-event"
              element={
                <AdminRoute>
                  <NewEvent />
                </AdminRoute>
              }
            />

          </Routes>
        </main>

        {/* footer */}
        <footer>
          <div className="container text-center">
            <p>paisley highland games</p>
          </div>
        </footer>

      </div>
    </Router>
  );
}

export default App;