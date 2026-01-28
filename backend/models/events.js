import mongoose from "mongoose";


// Sub-schema for each game + timeslot
const itineraryItemSchema = new mongoose.Schema({
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Game",
    required: true
  },
  timeslot: {
    type: String,
    required: true
  }
});

// EVENT SCHEMA
const eventSchema = new mongoose.Schema(
  {
    // event name
    event_name: {
      type: String,
      required: true,
    },

    // date of the event
    date: {
      type: Date,
      required: true,
    },

    // where the event is located (label for UI)
    location: {
      type: String,
      required: true,
    },

    // exact coordinates for maps (lat/lng)
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    },

    // short description of the event
    description: {
      type: String,
    },

    // Eventbrite ticket link
    eventbrite_link: {
      type: String,
    },

    // admin-uploaded image
    image_url: {
      type: String,
    },

    // itinerary: list of games + timeslots
    itinerary: [itineraryItemSchema],

    // whether users can still register
    registration_open: {
      type: Boolean,
      default: true,
    },

    // optional - admin who created the event
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;
