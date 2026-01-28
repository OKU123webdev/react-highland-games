import "../css/Compete.css";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const api = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* registration form */
function RegistrationForm({
  onSubmit,
  events,
  games,
  selectedEvent,
  handleEventChange,
  formData,
  handleInputChange,
  errors,
  handleLogin
}) {
  return (
    // REGISTRATION FORM SECTION
    <section className="registration py-5">
      <div className="container" style={{ maxWidth: "900px" }}>

        <h1 className="compete-heading mb-3">Participate in our events</h1>

        <p className="compete-paragraph">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras lacinia vitae nibh sed suscipit.
          Nunc metus lectus, pretium vitae lorem rutrum, iaculis convallis ante.
        </p>

        <p className="compete-paragraph mb-4">
          Pellentesque elementum vitae ipsum vel volutpat. Phasellus imperdiet ultricies dolor.
          Pellentesque eget eleifend lacus. Aliquam erat volutpat.
        </p>

        {/* login prompt */}
        <div className="d-flex align-items-center gap-3 mb-5">
          <h3 className="already-title mb-0">Already have an account?</h3>

          <button
            type="button"
            onClick={handleLogin}
            className="btn btn-login-small"
          >
            Login
          </button>
        </div>

        <h2 className="registration-title mb-4">New Participant Register</h2>

        {/* form */}
        <form onSubmit={onSubmit} className="register-form">
          <div className="row">
            {/* LEFT COLUMN */}
            <div className="col-md-6">
              <div className="mb-3">
                {/* firstname */}
                <label className="form-label">First name</label> 
                <input
                  type="text"
                  name="firstname"
                  className={`form-control ${errors.firstname ? "is-invalid" : ""}`}
                  value={formData.firstname}
                  onChange={handleInputChange}
                />
                {errors.firstname && <div className="invalid-feedback">{errors.firstname}</div>}
              </div>

            {/* email */}
              <div className="mb-3">
                <label className="form-label">Email address</label>
                <input
                  type="text"
                  name="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              {/* group participation */}
              <div className="mb-3">
                <label className="form-label">Will you be participating in a group?</label>
                <div>
                  {/* group = true */}
                  <label className="me-3">
                    <input
                      type="radio"
                      name="is_group"
                      value="true"
                      checked={formData.is_group === true}
                      onChange={handleInputChange}
                      className="form-check-input me-1"
                    />
                    Yes
                  </label>

                  {/* group = false */}
                  <label>
                    <input
                      type="radio"
                      name="is_group"
                      value="false"
                      checked={formData.is_group === false}
                      onChange={handleInputChange}
                      className="form-check-input me-1"
                    />
                    No
                  </label>
                </div>
              </div>

              {/* club affiliation */}
              <div className="mb-3">
                <label className="form-label">Do you have a club affiliation?</label>
                <div>
                  {/* has club = true */}
                  <label className="me-3">
                    <input
                      type="radio"
                      name="has_club"
                      value="true"
                      checked={formData.has_club === true}
                      onChange={handleInputChange}
                      className="form-check-input me-1"
                    />
                    Yes
                  </label>

                  {/* has club = false */}  
                  <label>
                    <input
                      type="radio"
                      name="has_club"
                      value="false"
                      checked={formData.has_club === false}
                      onChange={handleInputChange}
                      className="form-check-input me-1"
                    />
                    No
                  </label>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="col-md-6">
              <div className="mb-3">
                {/* last name */}
                <label className="form-label">Last name</label>
                <input
                  type="text"
                  name="lastname"
                  className={`form-control ${errors.lastname ? "is-invalid" : ""}`}
                  value={formData.lastname}
                  onChange={handleInputChange}
                />
                {errors.lastname && <div className="invalid-feedback">{errors.lastname}</div>}
              </div>

              {/* phone number */}
              <div className="mb-3">
                <label className="form-label">Phone number</label>
                <input
                  type="text"
                  name="phone_no"
                  className={`form-control ${errors.phone_no ? "is-invalid" : ""}`}
                  value={formData.phone_no}
                  onChange={handleInputChange}
                />
                {errors.phone_no && <div className="invalid-feedback">{errors.phone_no}</div>}
              </div>

              {/* group name */} 
              <div className="mb-3">
                <label className="form-label">Group name</label>
                <input
                  type="text"
                  name="group_name"
                  disabled={!formData.is_group}
                  value={formData.group_name}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>

              {/* club name */}
              <div className="mb-3">
                <label className="form-label">Club name</label>
                <input
                  type="text"
                  name="affiliation"
                  disabled={!formData.has_club}
                  value={formData.affiliation}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
            </div>
          </div>

          {/* SELECT EVENT/GAME */}
          <div className="row mb-4">
            <div className="col-md-6">
              {/* event selection */}
              <label className="form-label">Which event would you like to sign up for?</label>
              <select
                className={`form-select ${errors.event_id ? "is-invalid" : ""}`}
                value={selectedEvent}
                onChange={handleEventChange}
              >
                <option value="">Select an event...</option>
                {events.map(event => (
                  <option key={event._id} value={event._id}>{event.event_name}</option>
                ))}
              </select>
              {errors.event_id && <div className="invalid-feedback">{errors.event_id}</div>}
            </div>

            {/* game selection */}
            <div className="col-md-6">
              <label className="form-label">Game</label>
              <select
                name="game_id"
                className={`form-select ${errors.game_id ? "is-invalid" : ""}`}
                disabled={!selectedEvent}
                value={formData.game_id}
                onChange={handleInputChange}
              >
                <option value="">Select a game...</option>
                {games.map(game => (
                  <option key={game._id} value={game._id}>{game.game_name}</option>
                ))}
              </select>
              {errors.game_id && <div className="invalid-feedback">{errors.game_id}</div>}
            </div>
          </div>

          {/* consents */}
          <div className="form-check mb-3">
            <input
              type="checkbox"
              name="contact_consent"
              checked={formData.contact_consent}
              onChange={handleInputChange}
              className="form-check-input"
            />
            <label className="form-check-label">
              Do you consent to Paisley Highland Games contacting you with game information and updates?
            </label>
          </div>

          <div className="form-check mb-3">
            <input
              type="checkbox"
              name="score_consent"
              checked={formData.score_consent}
              onChange={handleInputChange}
              className="form-check-input"
            />
            <label className="form-check-label">
              Do you consent to Paisley Highland Games using your name and club affiliation to display scores?
            </label>
          </div>

          <div className="form-check mb-3">
            <input
              type="checkbox"
              name="marketing_consent"
              checked={formData.marketing_consent}
              onChange={handleInputChange}
              className="form-check-input"
            />
            <label className="form-check-label">
              Sign up for marketing emails about new events.
            </label>
          </div>

          <div className="form-check mb-4">
            <input
              type="checkbox"
              name="ppConsent"
              checked={formData.ppConsent}
              onChange={handleInputChange}
              className={`form-check-input ${errors.ppConsent ? "is-invalid" : ""}`}
            />
            <label className="form-check-label">
              I agree to the Terms and Conditions and Privacy Policy.
            </label>
            {errors.ppConsent && <div className="invalid-feedback d-block">{errors.ppConsent}</div>}
          </div>

          {/* SUBMIT */}
          <div className="text-center mt-4">
            <button type="submit" className="btn btn-signup">
              Sign up
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

/* AUTH0 REGISTER */
function Auth0Register({ email }) {
  const { loginWithRedirect } = useAuth0();
  
  // determine redirect URI
  const redirectUri = import.meta.env.DEV
    ? "http://localhost:5173/"
    : "https://paisley-highland-games-frontend.onrender.com/";

  useEffect(() => {
    // redirect to auth0 signup
    loginWithRedirect({
      authorizationParams: {
        screen_hint: 'signup',
        login_hint: email,
        redirect_uri: redirectUri
      }
    });
  }, [email, redirectUri, loginWithRedirect]);

  return (
    <section className="auth0Reg py-5">
      <div className="container text-center">
        <h2>create an account</h2>
        <p>please create an account to continue</p>
        <p>redirecting to signup...</p>
      </div>
    </section>
  );
}

// COMPETE PAGE
export default function Compete() {
  const { loginWithRedirect } = useAuth0();
  const navigate = useNavigate();

  // use state
  const [registrationStep, setRegistrationStep] = useState("form");
  const [events, setEvents] = useState([]);
  const [games, setGames] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");

  // form data
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone_no: "",
    is_group: false,
    group_name: "",
    has_club: false,
    affiliation: "",
    game_id: "",
    contact_consent: false,
    score_consent: false,
    marketing_consent: false,
    ppConsent: false
  });

  /* login */
  const handleLogin = () => {
    loginWithRedirect({
      redirectUri: import.meta.env.DEV
        ? "http://localhost:5173/"
        : "https://paisley-highland-games-frontend.onrender.com/"
    });
  };

  /* load events */
  useEffect(() => {
    axios.get(`${api}/api/events`)
      .then(res => setEvents(res.data))
      .catch(err => setError(err.message));
  }, []);

  /* load games */
  const handleEventChange = e => {
    const id = e.target.value;
    setSelectedEvent(id);

    if (!id) return setGames([]);

    axios
      .get(`${api}/api/games/events/${id}/games`)
      .then(res => setGames(res.data))
      .catch(err => setError(err.message));
  };

  /* input change */
  const handleInputChange = e => {
    const { name, type, value, checked } = e.target;

    const processed =
      type === "checkbox"
        ? checked
        : type === "radio"
        ? value === "true"
        : value;

    setFormData(prev => ({ ...prev, [name]: processed }));
  };

  /* validation */
  const validate = () => {
    const err = {};

    if (!formData.firstname.trim()) err.firstname = "first name required.";
    if (!formData.lastname.trim()) err.lastname = "last name required.";
    if (!formData.email.trim()) err.email = "email required.";
    if (!formData.phone_no.trim()) err.phone_no = "phone number required.";

    if (formData.is_group && !formData.group_name.trim())
      err.group_name = "group name required.";

    if (formData.has_club && !formData.affiliation.trim())
      err.affiliation = "club name required.";

    if (!selectedEvent) err.event_id = "select an event.";
    if (!formData.game_id) err.game_id = "select a game.";

    if (!formData.ppConsent) err.ppConsent = "you must accept the terms.";

    return err;
  };

  /* HANDLE SUBMIT */
  const handleSubmit = e => {
    e.preventDefault();

    // validate
    const err = validate();
    if (Object.keys(err).length > 0) return setErrors(err);

    const ev = events.find(x => x._id === selectedEvent);

    // Saveto localStorage
    localStorage.setItem(
      "pendingRegistration",
      JSON.stringify({
        ...formData,
        event_id: selectedEvent,
        event_name: ev?.event_name || ""
      })
    );
    
    // flag new user signup
    localStorage.setItem("newUserSignUp", "true");

    // Scroll to top
    window.scrollTo(0, 0);
    
    // proceed to auth0 registration
    setRegistrationStep("auth0");
  };

  return (
    <main>
      {registrationStep === "auth0" ? (
        <Auth0Register email={formData.email} />
      ) : (
        <RegistrationForm
          onSubmit={handleSubmit}
          events={events}
          games={games}
          selectedEvent={selectedEvent}
          handleEventChange={handleEventChange}
          formData={formData}
          handleInputChange={handleInputChange}
          errors={errors}
          handleLogin={handleLogin}
        />
      )}
    </main>
  );
}