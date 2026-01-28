import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import "../css/EventDetails.css";

function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  // load event details
  useEffect(() => {
    const getEvent = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/events/${id}`
        );
        setEvent(response.data);
      } catch (error) {
        console.error("Error loading event:", error);
      }
    };

    getEvent();
  }, [id]);

  if (!event) return null;

  // format date
  const formatDate = (dateString) =>
    dateString.split('T')[0].split('-').reverse().join('/');

  return (
    <main>

      {/* top content */}
      <section className="events-header py-5">
        <div className="container pt-5 pb-2">
          <h1 className="events-title">{event.event_name}</h1>
          <h3 className='event-date pb-3'>{formatDate(event.date)}</h3>
          <div className="events-intro">
            <p>{event.description}</p>
          </div>   
        </div>        
      </section>

      {/* schedule */}
      <section>
        <div className='container'>
          <h2 className='pb-3 event-sch'>Event Schedule</h2>

          {/* accordion */}
          <div className='accordion pb-4' id="gameAccordion">
            {event.itinerary && event.itinerary.map((item, index) => (
              <div className="accordion-item" key={index}>
                <h2 className="accordion-header" id={`heading${index}`}>
                  <button 
                    className='accordion-button collapsed'
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#game${index}`}
                    aria-expanded="false"
                    aria-controls={`game${index}`}
                  >
                    <strong className='pe-2'>{item.game?.game_name}</strong>
                    {item.timeslot}
                  </button>
                </h2>
                {/* game details */}
                <div 
                  id={`game${index}`} 
                  className="accordion-collapse collapse"
                  aria-labelledby={`heading${index}`}
                  data-bs-parent="#gameAccordion"
                >
                  <div className="accordion-body">
                    {item.game?.description || "No description available."}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* location */}
      <section>
        <div className='container py-4'>
          <div className="row shadow about-container">

            <div className="col-md-6 pt-5 mb-md-0 ps-5">
              <h2 className='location-hd'>Location</h2>
              <div className="text-center pt-4 pb-4 googleMaps">
                <img 
                  src="/images/googleMaps.png"
                  alt="Google Maps"
                  className='col-md-6 d-block mx-auto pb-3'
                />
                <p>Google Maps coming soon!</p>
              </div>
            </div>

            <div className="col-md-6 d-md-flex justify-content-md-end about-img">
              <img
                src={event.image_url}     
                alt={event.event_name}
                className="img-fluid"
              />
            </div>

          </div>
        </div>
      </section>

      {/* tickets */}
      <section id="tickets">
        <div className='container'>
          <h1 className='tickets-hd'>Tickets</h1>
          <div className='eventbrite my-4 d-flex justify-content-center align-items-center'>
            Eventbrite API coming soon.
          </div>
        </div>
      </section>

    </main>
  );
}

export default EventDetails;