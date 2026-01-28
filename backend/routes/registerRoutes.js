import express from "express";
import User from "../models/users.js";
import Participant from "../models/participant.js";
import EventRegistration from "../models/eventRegistration.js";

const router = express.Router();

// Create Registration data (User + Participant + EventRegistration)
router.post("/", async (req, res) => {
  try {
    console.log("Incoming registration data:", req.body);

    const {
      auth0_id,
      email,
      firstname,
      lastname,
      phone_no,
      affiliation,
      is_group,
      group_name,
      contact_consent,
      score_consent,
      marketing_consent,
      event_id,
      game_id
    } = req.body;

    // create/find user
    let user = await User.findOne({ auth0_id });
    if (!user) {
      user = new User({ auth0_id, email, role: 'participant' });
      await user.save();
    }

    // create participant profile
    const participant = new Participant({
      user_id: user._id,
      firstname,
      lastname,
      phone_no,
      affiliation,
      is_group: is_group === 'true' || is_group === true,
      group_name,
      contact_consent: contact_consent === 'true' || contact_consent === true,
      score_consent: score_consent === 'true' || score_consent === true,
      marketing_consent: marketing_consent === 'true' || marketing_consent === true
    });
    await participant.save();

    // create event registration
    const registration = new EventRegistration({
      participant_id: participant._id,
      event_id,
      game_id
    });
    await registration.save();

    res.status(201).json({
      message: 'Registration successful',
      user: { id: user._id, email: user.email, role: user.role },
      participant: { id: participant._id, name: `${firstname} ${lastname}` },
      registration: { id: registration._id, event_id, game_id }
    });

    // ERROR HANDLING
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed: " + error.message });
  }
});

export default router;