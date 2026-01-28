import "../css/Compete.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// USER SUCCESS PAGE
export default function UserSuccess() {

    const [reg, setReg] = useState(null);
    const [eventName, setEventName] = useState("the event");

    // backend url for render + localhost fallback
    const api = import.meta.env.VITE_API_URL || "http://localhost:5000";

    // load stored registration
    useEffect(() => {
        const saved = localStorage.getItem("userLoggedInRegistration");

        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setReg(parsed);

                // fetch event name if event_id exists
                if (parsed.event_id) {
                    axios
                        .get(`${api}/api/events/${parsed.event_id}`)
                        .then(res => {
                            if (res.data?.event_name) {
                                setEventName(`the ${res.data.event_name}`);
                            }
                        })
                        .catch(() => {
                            setEventName("the event");
                        });
                }

            } catch {
                setReg(null);
            }
        }
    }, [api]);

    return (
        <main>

            {/* header */}
            <section className="compete-header py-5">
                <div className="container pt-5 pb-4">
                    <h1 className="compete-title">Participation Successful</h1>
                </div>
            </section>

            {/* success message */}
            <section className="reg-success py-5">
                <div className="container">
                    <h2
                        style={{
                            fontFamily: "Lato, sans-serif",
                            fontSize: "2rem",
                            fontWeight: "600"
                        }}
                    >
                        You're registered!
                    </h2>

                    <p style={{ fontFamily: "Lato, sans-serif", marginTop: "1rem" }}>
                        You have successfully registered to participate in {eventName}.
                    </p>

                    <p style={{ fontFamily: "Lato, sans-serif" }}>
                        A confirmation email will be sent to you shortly with more details about the games.
                    </p>

                    <p style={{ fontFamily: "Lato, sans-serif" }}>
                        You can register for any additional events and games at any time.
                    </p>

                    {/* view events button */}
                    <Link
                        to="/events"
                        className="btn btn-signup"
                        style={{
                            borderRadius: "8px",
                            marginTop: "1.5rem",
                            display: "inline-block"
                        }}
                    >
                        view events
                    </Link>

                </div>
            </section>

        </main>
    );
}
