import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";

// Success page
function Success() {
  const navigate = useNavigate();

  useEffect(() => {
    // scroll to top
    window.scrollTo(0, 0);
  }, []);

  // check new sign up
  useEffect(() => {
    const isNew = localStorage.getItem("newUserSignUp");

    if (!isNew) {
      // redirect if not new sign up
      navigate("/");
      return;
    }

    // clear flag
    localStorage.removeItem("newUserSignUp");
  }, [navigate]);

  // event name from localStorage
  const pendingData = localStorage.getItem("pendingRegistration");
  const eventName = pendingData
    ? JSON.parse(pendingData).event_name
    : "the event";

  // RENDER SUCCESS PAGE
  return (
    <main>
      <section className="compete-header py-5">
        <div className="container pt-5 pb-4">
          <h1 className="compete-title">Participate in our events</h1>

          {/* intro text */}
          <div className="compete-intro">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras
              lacinia vitae nibh sed suscipit. Nunc metus lectus, pretium vitae
              felis rutrum, iaculis convallis ante.
            </p>
            <p>
              Pellentesque elementum vitae ipsum sed volutpat. Phasellus
              imperdiet ultrices dolor, ut pellentesque nisl blandit in.
            </p>
          </div>
        </div>
      </section>

      {/* registration success message */}
      <section className="reg-success py-5">
        <div className="container">
          <h1>Congratulations!</h1>
          <p>
            You are now a participant for <strong>{eventName}</strong>. You will
            receive an email with further information.
          </p>
          <p>You can now sign up to participate in new games on the Events page.</p>
        </div>
      </section>
    </main>
  );
}

export default Success;
