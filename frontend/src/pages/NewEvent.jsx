import "../css/NewEvent.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

// success message
function Success() {
    const navigate = useNavigate();

    // scroll to top on load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // button handlers
    const handleViewEvents = () => {
        navigate("/events");
    };

    const handleCreateNew = () => {
        window.location.reload();
    };

    return (
        // success section
        <section className="success">
            <div className="container">
                <h1>Success! The new event has been created.</h1>

                <div className="row pt-4 pb-3">
                    <div className="col-md-auto">
                        <button
                            type="button"
                            className="btn btn-view-events"
                            onClick={handleViewEvents}
                        >
                            View in Events
                        </button>
                    </div>

                    <div className="col-md-auto">
                        <button
                            type="button"
                            className="btn btn-create-new"
                            onClick={handleCreateNew}
                        >
                            Create New Event
                        </button>
                    </div>
                </div>
            </div>

            {/* full-width image */}
            <img
                src="https://res.cloudinary.com/ddsqzqwcx/image/upload/v1765138640/highland-games-events/w2y1czkh3quz3zphq3ff.jpg"
                alt="highland cow"
                className="success-img"
            />
        </section>
    );
}

// itinerary 
function Itinerary({ onItineraryUpdate }) {
    const [games, setGames] = useState([]);
    const [itinerary, setItinerary] = useState([{ game: "", timeslot: "" }]);

    // get games from backend
    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_API_URL}/api/games`)
            .then((res) => setGames(res.data))
            .catch((err) => console.error("error loading games: ", err));
    }, []);

    // send itinerary to parent
    useEffect(() => {
        onItineraryUpdate(itinerary);
    }, [itinerary, onItineraryUpdate]);

    // add new row
    const addRow = () => {
        setItinerary([...itinerary, { game: "", timeslot: "" }]);
    };

    // remove a row
    const removeRow = (index) => {
        if (itinerary.length > 1) {
            const updated = [...itinerary];
            updated.splice(index, 1);
            setItinerary(updated);
        }
    };

    // update row values
    const updateItinary = (index, field, value) => {
        const updated = [...itinerary];
        updated[index][field] = value;
        setItinerary(updated);
    };

    return (
        <div>
            <p className="fw-bold">Itinerary</p>

            {/* column headers */}
            <div className="row mb-2">
                <div className="col-md-6">
                    <label className="new-form-label fw-bold">Select Game</label>
                </div>
                <div className="col-md-4">
                    <label className="new-form-label fw-bold">Timeslot</label>
                </div>
                <div className="col-md-2"></div>
            </div>

            {/* itinerary rows */}
            {itinerary.map((item, index) => (
                <div key={index} className="row mb-3 align-items-center">

                    {/* game select */}
                    <div className="col-md-6">
                        <select
                            className="form-select"
                            value={item.game}
                            onChange={(e) => updateItinary(index, "game", e.target.value)}
                        >
                            <option value="">Select a game...</option>
                            {games.map((game) => (
                                <option key={game._id} value={game._id}>
                                    {game.game_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* timeslot input */}
                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="e.g. 10:00 - 11:00"
                            value={item.timeslot}
                            onChange={(e) => updateItinary(index, "timeslot", e.target.value)}
                        />
                    </div>

                    {/* remove row button */}
                    <div className="col-md-2">
                        <button
                            type="button"
                            className="btn p-2 border-0"
                            onClick={() => removeRow(index)}
                            disabled={itinerary.length === 1}
                        >
                            <svg width="30" height="30" fill="white" viewBox="0 0 24 24">
                                <path d="m12.002 2.005c5.518 0 9.998 4.48 9.998 9.997 0 5.518-4.48 9.998-9.998 9.998-5.517 0-9.997-4.48-9.997-9.998 0-5.517 4.48-9.997 9.997-9.997zm4.253 9.25h-8.5c-.414 0-.75.336-.75.75s.336.75.75.75h8.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75z" />
                            </svg>
                        </button>
                    </div>
                </div>
            ))}

            {/* add row button */}
            <button
                type="button"
                className="btn p-2 border-0"
                onClick={addRow}
            >
                <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm.75 5.75h-1.5v3.5h-3.5v1.5h3.5v3.5h1.5v-3.5h3.5v-1.5h-3.5v-3.5z" />
                </svg>
            </button>
        </div>
    );
}

// new event page
function NewEvent() {
    const navigate = useNavigate();

    // form state
    const [formData, setFormData] = useState({
        event_name: "",
        date: "",
        eventbrite_link: "",
        location: "",
        coordinates: "",
        description: "",
        event_image: null
    });

    // validation state
    const [errors, setErrors] = useState({});
    const [itinerary, setItinerary] = useState([]);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.event_name.trim()) {
            newErrors.event_name = "please enter an event name";
        }

        if (!formData.date) {
            newErrors.date = "please enter a date";
        }

        if (!formData.location.trim()) {
            newErrors.location = "please enter a location";
        }

        if (!formData.coordinates.trim()) {
            newErrors.coordinates = "please enter coordinates";
        } else {
            const coordPattern = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/;
            if (!coordPattern.test(formData.coordinates)) {
                newErrors.coordinates =
                    "coordinates must be in the format: 55.847, -4.423";
            }
        }

        if (!formData.description.trim()) {
            newErrors.description = "please enter a description";
        }

        // itinerary validation
        for (const row of itinerary) {
            if (!row.game || !row.timeslot.trim()) {
                newErrors.itinerary =
                    "please complete all itinerary rows or remove them";
                break;
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // handle inputs
    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "file" ? files[0] : value
        }));
    };

    const handleItineraryUpdate = (data) => {
        setItinerary(data);
    };

    // handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const fd = new FormData();
            // append fields
            fd.append("event_name", formData.event_name);
            fd.append("date", formData.date);
            fd.append("eventbrite_link", formData.eventbrite_link);
            fd.append("location", formData.location);
            fd.append("coordinates", formData.coordinates);
            fd.append("description", formData.description);
            fd.append("registration_open", "true");
            fd.append("itinerary", JSON.stringify(itinerary));

            if (formData.event_image) {
                fd.append("event_image", formData.event_image);
            }

            await axios.post(`${import.meta.env.VITE_API_URL}/api/events`, fd, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            setIsSubmitted(true);
        } catch (error) {
            console.error("error creating event:", error);
        }
    };

    // RENDER NEW EVENT PAGE
    return (
        <main>
            {isSubmitted ? (
                <Success />
            ) : (
                <section className="new-event-main">
                    <div className="container py-5">
                        <h1 className="new-event-heading">New Event</h1>

                        <div className="new-event-form">
                            {/* form */}
                            <form onSubmit={handleSubmit}>
                                <div className="row pt-4">

                                    {/* left column */}
                                    <div className="col-md-6">

                                        {/* event name */}
                                        <div className="mb-3 form-row">
                                            <label className="new-form-label">Event Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="event_name"
                                                value={formData.event_name}
                                                onChange={handleInputChange}
                                            />
                                            {errors.event_name && (
                                                <p className="error-text">{errors.event_name}</p>
                                            )}
                                        </div>

                                        {/* date */}
                                        <div className="mb-3 form-row">
                                            <label className="new-form-label">Date</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                name="date"
                                                value={formData.date}
                                                onChange={handleInputChange}
                                            />
                                            {errors.date && (
                                                <p className="error-text">{errors.date}</p>
                                            )}
                                        </div>

                                        {/* eventbrite link */}
                                        <div className="mb-3 form-row">
                                            <label className="new-form-label">Eventbrite Link</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="eventbrite_link"
                                                value={formData.eventbrite_link}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    {/* right column */}
                                    <div className="col-md-6">

                                        {/* location */}
                                        <div className="mb-3 form-row">
                                            <label className="new-form-label">Location</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleInputChange}
                                            />
                                            {errors.location && (
                                                <p className="error-text">{errors.location}</p>
                                            )}
                                        </div>

                                        {/* coordinates */}
                                        <div className="mb-3 form-row">
                                            <label className="new-form-label">Coordinates</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="coordinates"
                                                value={formData.coordinates}
                                                onChange={handleInputChange}
                                            />
                                            {errors.coordinates && (
                                                <p className="error-text">{errors.coordinates}</p>
                                            )}
                                        </div>

                                        {/* image upload */}
                                        <div className="mb-3 form-row">
                                            <label className="new-form-label">Image Upload</label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                name="event_image"
                                                accept="image/*"
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Itinerary onItineraryUpdate={handleItineraryUpdate} />

                                {/* itinerary errors */}
                                {errors.itinerary && (
                                    <p className="error-text">{errors.itinerary}</p>
                                )}

                                {/* description */}
                                <div className="mb-3 pt-4 form-row">
                                    <label className="new-form-label">Description</label>
                                    <textarea
                                        className="form-control"
                                        name="description"
                                        rows="5"
                                        placeholder="Enter event description..."
                                        value={formData.description}
                                        onChange={handleInputChange}
                                    ></textarea>
                                    {errors.description && (
                                        <p className="error-text">{errors.description}</p>
                                    )}
                                </div>

                                {/* submit */}
                                <div className="row mt-4">
                                    <div className="col-12 text-end">
                                        <button type="submit" className="btn btn-create-event">
                                            Create Event
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}

export default NewEvent;
