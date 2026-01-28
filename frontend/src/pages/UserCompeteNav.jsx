import "../css/Compete.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

export default function UserCompeteNav() {

  const api = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const { user } = useAuth0();
  const navigate = useNavigate();

  // state for events, games, errors
  const [events, setEvents] = useState([]);
  const [games, setGames] = useState([]);
  const [errors, setErrors] = useState({});
  const [selectedEventName, setSelectedEventName] = useState("");

  // form data
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: user?.email || "",
    phone_no: "",
    event_id: "",
    game_id: "",
    is_group: false,
    has_club: false,
    group_name: "",
    affiliation: "",
    contact_consent: false,
    score_consent: false,
    marketing_consent: false,
    ppConsent: false,
  });

  // load events
  useEffect(() => {
    axios
      .get(`${api}/api/events`)
      .then((res) => setEvents(res.data))
      .catch((err) => console.log("events load error:", err));
  }, []);

  // load games when event changes
  const handleEventChange = async (e) => {
    const eventId = e.target.value;

    setFormData((prev) => ({ ...prev, event_id: eventId, game_id: "" }));

    const ev = events.find((x) => x._id === eventId);
    setSelectedEventName(ev ? ev.event_name : "");

    if (!eventId) {
      setGames([]);
      return;
    }

    try {
      const result = await axios.get(`${api}/api/games/events/${eventId}/games`);
      setGames(result.data);
    } catch (err) {
      console.log("games load error:", err);
    }
  };

  // handle all input types
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    let processed = type === "checkbox" ? checked : value;
    if (type === "radio") processed = value === "true";

    setFormData((prev) => ({ ...prev, [name]: processed }));
  };

  // validation rules
  const validate = () => {
    const err = {};

    if (!formData.firstname.trim()) err.firstname = "First name is required.";
    if (!formData.lastname.trim()) err.lastname = "Last name is required.";
    if (!formData.phone_no.trim()) err.phone_no = "Phone number is required.";

    if (!formData.event_id) err.event_id = "Event selection is required.";
    if (!formData.game_id) err.game_id = "Game selection is required.";

    if (formData.is_group && !formData.group_name.trim())
      err.group_name = "Group name is required.";

    if (formData.has_club && !formData.affiliation.trim())
      err.affiliation = "Club name is required.";

    if (!formData.ppConsent)
      err.ppConsent = "You must accept the Terms & Conditions.";

    return err;
  };

  // submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    const found = validate();

    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }

    localStorage.setItem("userLoggedInRegistration", JSON.stringify(formData));

    navigate("/user-success");
  };

  // RENDER COMPETE FORM
  return (
    <main>
      <section className="registration py-5">
        <div className="container">

          {/* title */}
          <h2 className="registration-title">
            Hi {user?.nickname || user?.name}, Ready To Take Part?
          </h2>

          {/* subtitle */}
          <p className="text-muted">
            You're Registering For: <strong>{selectedEventName || "—"}</strong>
          </p>

          {/* form wrapper */}
          <div className="register-form">
            <form onSubmit={handleSubmit}>
              <div className="row">

                {/* left column */}
                <div className="col-md-6">

                  {/* first name */}
                  <label className="form-label">First Name</label>
                  <input
                    className={`form-control ${errors.firstname ? "is-invalid" : ""}`}
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleInputChange}
                  />
                  {errors.firstname && (
                    <div className="invalid-feedback">{errors.firstname}</div>
                  )}

                  {/* email */}
                  <label className="form-label mt-3">Email Address</label>
                  <input className="form-control" value={formData.email} disabled />

                  {/* group participation */}
                  <label className="form-label mt-3">Will you be participating in a group?</label>
                  <div>
                    <input
                      type="radio"
                      name="is_group"
                      value="true"
                      checked={formData.is_group === true}
                      onChange={handleInputChange}
                    />{" "}
                    Yes
                    <input
                      type="radio"
                      className="ms-3"
                      name="is_group"
                      value="false"
                      checked={formData.is_group === false}
                      onChange={handleInputChange}
                    />{" "}
                    No
                  </div>

                  {/* club affiliation */}
                  <label className="form-label mt-3">Do you have a club affiliation?</label>
                  <div>
                    <input
                      type="radio"
                      name="has_club"
                      value="true"
                      checked={formData.has_club === true}
                      onChange={handleInputChange}
                    />{" "}
                    Yes
                    <input
                      type="radio"
                      className="ms-3"
                      name="has_club"
                      value="false"
                      checked={formData.has_club === false}
                      onChange={handleInputChange}
                    />{" "}
                    No
                  </div>

                </div>

                {/* right column */}
                <div className="col-md-6">

                  {/* last name */}
                  <label className="form-label">Last Name</label>
                  <input
                    className={`form-control ${errors.lastname ? "is-invalid" : ""}`}
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleInputChange}
                  />
                  {errors.lastname && (
                    <div className="invalid-feedback">{errors.lastname}</div>
                  )}

                  {/* phone number */}
                  <label className="form-label mt-3">Phone Number</label>
                  <input
                    className={`form-control ${errors.phone_no ? "is-invalid" : ""}`}
                    name="phone_no"
                    value={formData.phone_no}
                    onChange={handleInputChange}
                  />
                  {errors.phone_no && (
                    <div className="invalid-feedback">{errors.phone_no}</div>
                  )}

                  {/* group name */}
                  <label className="form-label mt-3">Group Name</label>
                  <input
                    className={`form-control ${errors.group_name ? "is-invalid" : ""}`}
                    name="group_name"
                    value={formData.group_name}
                    onChange={handleInputChange}
                    disabled={!formData.is_group}
                  />
                  {errors.group_name && (
                    <div className="invalid-feedback d-block">{errors.group_name}</div>
                  )}

                  {/* club name */}
                  <label className="form-label mt-3">Club Name</label>
                  <input
                    className={`form-control ${errors.affiliation ? "is-invalid" : ""}`}
                    name="affiliation"
                    value={formData.affiliation}
                    onChange={handleInputChange}
                    disabled={!formData.has_club}
                  />
                  {errors.affiliation && (
                    <div className="invalid-feedback d-block">{errors.affiliation}</div>
                  )}

                </div>
              </div>

              {/* event + game */}
              <div className="row mt-4">

                {/* select event */}
                <div className="col-md-6">
                  <label className="form-label">Select Event</label>
                  <select
                    className={`form-select ${errors.event_id ? "is-invalid" : ""}`}
                    name="event_id"
                    value={formData.event_id}
                    onChange={handleEventChange}
                  >
                    <option value="">Select An Event...</option>
                    {events.map((ev) => (
                      <option key={ev._id} value={ev._id}>
                        {ev.event_name}
                      </option>
                    ))}
                  </select>
                  {errors.event_id && (
                    <div className="invalid-feedback">{errors.event_id}</div>
                  )}
                </div>

                {/* select game */}
                <div className="col-md-6">
                  <label className="form-label">Select Game</label>
                  <select
                    className={`form-select ${errors.game_id ? "is-invalid" : ""}`}
                    name="game_id"
                    value={formData.game_id}
                    onChange={handleInputChange}
                    disabled={!games.length}
                  >
                    <option value="">Select A Game...</option>
                    {games.map((g) => (
                      <option key={g._id} value={g._id}>
                        {g.game_name}
                      </option>
                    ))}
                  </select>
                  {errors.game_id && (
                    <div className="invalid-feedback">{errors.game_id}</div>
                  )}
                </div>

              </div>

              {/* consents */}
              <div className="form-check mt-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="contact_consent"
                  checked={formData.contact_consent}
                  onChange={handleInputChange}
                />
                <label className="form-check-label">
                  Do you consent to Paisley Highland Games contacting you with updates?
                </label>
              </div>

              <div className="form-check mt-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="score_consent"
                  checked={formData.score_consent}
                  onChange={handleInputChange}
                />
                <label className="form-check-label">
                  Do you consent to your scores being publicly displayed?
                </label>
              </div>

              <div className="form-check mt-2">
                <input
                  className={`form-check-input ${errors.ppConsent ? "is-invalid" : ""}`}
                  type="checkbox"
                  name="ppConsent"
                  checked={formData.ppConsent}
                  onChange={handleInputChange}
                />
                <label className="form-check-label">
                  I agree to the Terms and Conditions and Privacy Policy.
                </label>
                {errors.ppConsent && (
                  <div className="invalid-feedback d-block">{errors.ppConsent}</div>
                )}
              </div>

              {/* submit button */}
              <div className="text-end mt-4">
                <button type="submit" className="btn btn-signup">
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
