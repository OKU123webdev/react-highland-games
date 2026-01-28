import mongoose from "mongoose";

// PARTICIPANT SCHEMA
const participantSchema = new mongoose.Schema( 
    { 
        // user id
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        // user names
        firstname: { 
            type: String,
            required: true, // users must provide their first name
        },

        lastname: { 
            type: String,
            required: true, // users must provide their last name  
        },

        // phone number
        phone_no: { 
            type: String,
        },

        // club affiliation
        affiliation: { 
            type: String,
            default: "",
        },

        // group registration options 
        is_group: { 
            type: Boolean, 
            default: false,
        },

        group_name: { 
            type: String,
            default: "", 
        },

        // GDPR consents 
        contact_consent: { 
            type: Boolean,
            default: false,
        },

        score_consent: {
            type: Boolean, 
            default: false,
        },

        marketing_consent: {
            type: Boolean,
            default: false,
        }

    },

    // timestamps automatically create "createAt" and "updateAt" fields 
    { timestamps: true }
);

// create & export MongoDB  model 
const Participant = mongoose.model("Participant", participantSchema);
export default Participant;