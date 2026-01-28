import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import "../css/Events.css";

function Events() {
  const navigate = useNavigate();

  // get events
  const [events, setEvents] = useState([]);

  // check auth
  const { isAuthenticated, user } = useAuth0();

  // user role
  const [userRole, setUserRole] = useState("guest");

  // fetch role
  useEffect(() => {
    const fetchRole = async () => {
      if (isAuthenticated && user) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/users/role?auth0Id=${user.sub}`
          );
          setUserRole(response.data.role);
        } catch {
          setUserRole("participant");
        }
      } else {
        setUserRole("guest");
      }
    };

    fetchRole();
  }, [isAuthenticated, user]);

  // load events
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/events`)
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("events load error:", err));
  }, []);

  // format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB");
  };

  // dynamic card buttons
  const cardButtons = (event) => {
    if (userRole === "admin") {
      return (
        <div className="card-buttons">
          <button
            className="btn-admin"
            onClick={() => navigate('/news')}
          >
            Edit
          </button>
        </div>
      );
    }

    return (
      <div className="card-buttons">
        <button
          className="btn-buy"
          onClick={() => navigate(`/event/${event._id}#tickets`)}
        >
          Buy Tickets
        </button>

        <button
          className="btn-part"
          onClick={() => {
            if (isAuthenticated) {
              navigate(`/user-compete?event=${event._id}`);
            } else {
              navigate("/compete");
            }
          }}
        >
          Participate
        </button>
      </div>
    );
  };

  return (
    <section className="events-page">
      <div className="events-container">

        <h1 className="events-heading">Our Events</h1>

        {/* intro paragraph */}
        <p className="events-intro">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras lacinia vel augue sed suscipit.
          Nunc metus lectus, pretium vitae felis rutrum, iaculis convallis ante. Maecenas nec accumsan
          dolor, vitae cursus magna. Donec pulvinar placerat dolor, eget eleifend ante blandit vitae.
          Pellentesque elementum vitae ipsum sed volutpat. Phasellus imperdiet ultricies dolor et placerat.
        </p>

        {/* admin-only add event button */}
        {userRole === "admin" && (
          <button
            className="btn-admin-top"
            onClick={() => navigate("/new-event")}
          >
            Create New Event
          </button>
        )}

        {/* events grid */}
        <div className="events-grid">
          {events.map((event) => (
            <div className="event-card" key={event._id}>

              {/* image */}
              <img
                src={event.image_url}
                alt={event.event_name}
                className="event-img"
                onClick={() => navigate(`/event/${event._id}`)}
              />

              {/* content */}
              <div className="event-content">
                <h4>{event.event_name}</h4>
                <p className="event-date">{formatDate(event.date)}</p>
                <p className="event-location">{event.location}</p>

                {/* buttons */}
                {cardButtons(event)}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Events;
