// check gameRoutes is running
console.log("gameRoutes.js loaded"); 

// import dependencies
import express from "express";
import Game from "../models/games.js";
import Event from "../models/events.js";

const router = express.Router();

// debug
router.use((req, res, next) => {
  console.log(`Game Route Hit → ${req.method} ${req.originalUrl}`);
  next();
});

// CREATE NEW GAME
router.post("/", async (req, res) => {
  try {
    console.log("Incoming game data:", req.body);

    // ensure required fields exist before saving
    if (!req.body.game_name) {
      return res.status(400).json({
        error: "Missing required field: game_name",
      });
    }

    // save
    const newGame = new Game(req.body);
    await newGame.save();

    res.status(201).json({
      message: "Game created successfully", //success
      game: newGame,
    });

    // ERROR HANDLING
  } catch (error) {
    console.error("Error creating game:", error);
    res.status(500).json({ error: "Failed to create game" }); //error
  }
});

// GET ALL GAMES
router.get("/", async (req, res) => {
  try {
    const games = await Game.find();

    console.log(`Sending ${games.length} games`);

    res.json(games);

  } catch (error) {
    console.error("Error fetching games:", error);
    res.status(500).json({ error: "Failed to fetch games" });
  }
});

// GET GAMES FOR SPECIFIC EVENT
router.get("/events/:eventId/games", async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId).populate("itinerary.game");
    if (!event) return res.status(404).json({ error: "Event not found" });
    
    const games = event.itinerary.map(item => item.game);
    res.json(games);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to fetch games" });
  }
});

// GET SINGLE GAME BY ID
router.get("/:id", async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) return res.status(404).json({ error: "Game not found" });

    res.json(game);

  } catch (error) {
    console.error("Error loading game:", error);
    res.status(500).json({ error: "Failed to load game" });
  }
});


// UPDATE GAME BY ID
router.put("/:id", async (req, res) => {
  try {
    const updatedGame = await Game.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedGame)
      return res.status(404).json({ error: "Game not found" });

    res.json({
      message: "Game updated successfully",
      game: updatedGame,
    });

  } catch (error) {
    console.error("Error updating game:", error);
    res.status(500).json({ error: "Failed to update game" });
  }
});

// DELETE GAME BY ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Game.findByIdAndDelete(req.params.id);

    if (!deleted)
      return res.status(404).json({ error: "Game not found" });

    res.json({ message: "Game deleted successfully" });

  } catch (error) {
    console.error("Error deleting game:", error);
    res.status(500).json({ error: "Failed to delete game" });
  }
});

export default router;
