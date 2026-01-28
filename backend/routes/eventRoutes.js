// check eventroutes is running
console.log("eventroutes.js loaded"); 

// import dependencies
import express from "express";
import Event from "../models/events.js";

// cloudinary imports
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const router = express.Router();

// cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "highland-games-events",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

// multer upload handler using cloudinary storage
const upload = multer({ storage });

// debug
router.use((req, res, next) => {
  console.log(`event route hit → ${req.method} ${req.originalUrl}`);
  next();
});

// CREATE NEW EVENT
router.post("/", upload.single("event_image"), async (req, res) => {
  try {

    // cloudinary returns path OR url depending on version
    const imageUrl = req.file?.path || req.file?.url || null;

    // fix coordinates (convert string to object)
    let coordinates = null;
    if (req.body.coordinates) {
      const parts = req.body.coordinates.split(",").map(p => p.trim());
      coordinates = {
        lat: parseFloat(parts[0]),
        lng: parseFloat(parts[1])
      };
    }

    const eventData = {
      ...req.body,
      itinerary: req.body.itinerary ? JSON.parse(req.body.itinerary) : [],
      image_url: imageUrl,
      coordinates: coordinates
    };

    if (eventData.itinerary && !Array.isArray(eventData.itinerary)) {
      return res.status(400).json({
        error: "itinerary must be an array",
      });
    }

    const newEvent = new Event(eventData);
    await newEvent.save();

    res.status(201).json({
      message: "event created successfully",
      event: newEvent,
    });

    // ERROR HANDLING
  } catch (error) {
    console.error("error creating event:", error);
    res.status(500).json({ error: "failed to create event" });
  }
});

// GET ALL EVENTS
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    console.log(`sending ${events.length} events`);
    res.json(events);
  } catch (error) {
    console.error("error fetching events:", error);
    res.status(500).json({ error: "failed to fetch events" });
  }
});

// GET SINGLE EVENT BY ID
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("itinerary.game");

    if (!event) {
      return res.status(404).json({ error: "event not found" });
    }

    res.json(event);
  } catch (error) {
    console.error("error loading event:", error);
    res.status(500).json({ error: "failed to load event" });
  }
});

// UPDATE EVENT BY ID
router.put("/:id", async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ error: "event not found" });
    }

    res.json({
      message: "event updated successfully",
      event: updatedEvent,
    });

  } catch (error) {
    console.error("error updating event:", error);
    res.status(500).json({ error: "failed to update event" });
  }
});

// DELETE EVENT BY ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "event not found" });
    }

    res.json({ message: "event deleted successfully" });

  } catch (error) {
    console.error("error deleting event:", error);
    res.status(500).json({ error: "failed to delete event" });
  }
});

export default router;
