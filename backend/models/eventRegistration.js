import mongoose from "mongoose";

const eventRegistrationSchema = new mongoose.Schema({
    // link to participant table
    participant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Participant',
        required: true
    },
    // link to events table
    event_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    // link to games table
    game_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: true
    }
}, {
  timestamps: true
});

const EventRegistration = mongoose.model("EventRegistration", eventRegistrationSchema);
export default EventRegistration;