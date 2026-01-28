import "../css/Compete.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useSearchParams, useNavigate } from "react-router-dom";

// UserCompete component
export default function UserCompete() {
  const api = import.meta.env.VITE_API_URL;
  const { user } = useAuth0();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // get event from url
  const eventFromUrl = searchParams.get("event");

  const [eventData, setEventData] = useState(null);
  const [games, setGames] = useState([]);
  const [errors, setErrors] = useState({});

  // form data
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: user?.email || "",
    phone_no: "",
    event_id: eventFromUrl || "",
    game_id: "",
    is_group: false,
    has_club: false,
    group_name: "",
    affiliation: "",
    contact_consent: false,
    score_consent: false,
    ppConsent: false,
  });

  // load event details
  useEffect(() => {
    if (!eventFromUrl) return;

    axios
      .get(`${api}/api/events/${eventFromUrl}`)
      .then((res) => setEventData(res.data))
      .catch((err) => console.error("event load error:", err));
  }, [api, eventFromUrl]);

  // load games
  useEffect(() => {
    if (!eventFromUrl) return;

    axios
      .get(`${api}/api/games/events/${eventFromUrl}/games`)
      .then((res) => setGames(res.data))
      .catch((err) => console.error("games load error:", err));
  }, [api, eventFromUrl]);

  // handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const processed = type === "checkbox" ? checked : type === "radio" ? value === "true" : value;
    setFormData((prev) => ({ ...prev, [name]: processed }));
  };

  // validate form
  const validate = () => {
    const err = {};

    if (!formData.firstname.trim()) err.firstname = "First name is required.";
    if (!formData.lastname.trim()) err.lastname = "Last name is required.";
    if (!formData.phone_no.trim()) err.phone_no = "Phone number is required.";

    if (!formData.game_id) err.game_id = "Game selection is required.";

    if (formData.is_group && !formData.group_name.trim())
      err.group_name = "Group name is required.";

    if (formData.has_club && !formData.affiliation.trim())
      err.affiliation = "Club name is required.";

    if (!formData.ppConsent)
      err.ppConsent = "You must accept the Terms & Conditions.";

    return err;
  };

  // SUBMIT HANDLER
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

  const eventName = eventData?.event_name || "Your Event";

  // RENDER REGISTRATION FORM
  return (
    <main>
      <section className="registration py-5">
        <div className="container" style={{ maxWidth: "900px" }}>
          
          <h2 className="registration-title mb-3">
            Hi {user?.nickname || user?.name}, Ready To Take Part?
          </h2>

          <p className="text-muted mb-4">
            You're Registering For: <strong>{eventName}</strong>
          </p>

          {/* FORM */}
          <div className="register-form">
            <form onSubmit={handleSubmit}>
              
              {/* firstname*/}
              <div className="row mb-3">
                <div className="col-md-6">
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
                </div>

                {/* last name */}
                <div className="col-md-6">
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
                </div>
              </div>

              {/* email */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Email Address</label>
                  <input className="form-control" value={formData.email} disabled />
                </div>

                {/* phone number */}
                <div className="col-md-6">
                  <label className="form-label">Phone Number</label>
                  <input
                    className={`form-control ${errors.phone_no ? "is-invalid" : ""}`}
                    name="phone_no"
                    value={formData.phone_no}
                    onChange={handleInputChange}
                  />
                  {errors.phone_no && (
                    <div className="invalid-feedback">{errors.phone_no}</div>
                  )}
                </div>
              </div>

              {/* group participation */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Will You Be Participating In A Group?</label>
                  <div>
                    {/* group = true */}
                    <input
                      type="radio"
                      name="is_group"
                      value="true"
                      checked={formData.is_group === true}
                      onChange={handleInputChange}
                    />{" "}
                    Yes
                    {/* group = false */}
                    <input
                      type="radio"
                      name="is_group"
                      value="false"
                      className="ms-3"
                      checked={formData.is_group === false}
                      onChange={handleInputChange}
                    />{" "}
                    No
                  </div>
                </div>

                {/* group name */}
                <div className="col-md-6">
                  <label className="form-label">Group Name</label>
                  <input
                    className={`form-control ${errors.group_name ? "is-invalid" : ""}`}
                    name="group_name"
                    disabled={!formData.is_group}
                    value={formData.group_name}
                    onChange={handleInputChange}
                  />
                  {errors.group_name && (
                    <div className="invalid-feedback">{errors.group_name}</div>
                  )}
                </div>
              </div>

              {/* club affiliation */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Do You Have A Club Affiliation?</label>
                  <div>
                    {/* has_club = true */}
                    <input
                      type="radio"
                      name="has_club"
                      value="true"
                      checked={formData.has_club === true}
                      onChange={handleInputChange}
                    />{" "}
                    Yes
                    {/* has_club = false */}
                    <input
                      type="radio"
                      name="has_club"
                      value="false"
                      className="ms-3"
                      checked={formData.has_club === false}
                      onChange={handleInputChange}
                    />{" "}
                    No
                  </div>
                </div>

                {/* club name */}
                <div className="col-md-6">
                  <label className="form-label">Club Name</label>
                  <input
                    className={`form-control ${errors.affiliation ? "is-invalid" : ""}`}
                    name="affiliation"
                    disabled={!formData.has_club}
                    value={formData.affiliation}
                    onChange={handleInputChange}
                  />
                  {errors.affiliation && (
                    <div className="invalid-feedback">{errors.affiliation}</div>
                  )}
                </div>
              </div>

              {/* game dropdown */}
              <div className="row mb-4">
                <div className="col-md-12">
                  <label className="form-label">Select Game</label>
                  <select
                    className={`form-select ${errors.game_id ? "is-invalid" : ""}`}
                    name="game_id"
                    value={formData.game_id}
                    onChange={handleInputChange}
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
              <div className="form-check mb-2">
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

              <div className="form-check mb-2">
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

              <div className="form-check mb-3">
                <input
                  className={`form-check-input ${errors.ppConsent ? "is-invalid" : ""}`}
                  type="checkbox"
                  name="ppConsent"
                  checked={formData.ppConsent}
                  onChange={handleInputChange}
                />
                <label className="form-check-label">
                  I agree to the Terms & Conditions and Privacy Policy.
                </label>
              </div>

              {/* submit */}
              <div className="text-end mt-4">
                <button type="submit" className="btn btn-signup">
                  Submit Registration
                </button>
              </div>

            </form>
          </div>

        </div>
      </section>
    </main>
  );
}
