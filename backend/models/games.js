import mongoose from "mongoose";

// GAME SCHEMA
const gameSchema = new mongoose.Schema(
  {

    // game name  
    game_name: {
      type: String,
      required: true,
    },

    // game description
    description: {
      type: String,
    }
  },

    { timestamps: true }

);

const Game = mongoose.model("Game", gameSchema);

export default Game;
