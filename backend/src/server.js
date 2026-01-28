import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
// import routes
import eventsRoutes from "../routes/eventRoutes.js";
import gamesRoutes from "../routes/gameRoutes.js";
import usersRoutes from "../routes/userRoutes.js";
// import path modules
import path from "path";
import { fileURLToPath } from "url";

// dirname fix for esm
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// CONNECT TO MONGO DB
connectDB();

const app = express();

// middleware
app.use(express.json());

// static file serving
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// CORS
app.use(
  cors({
    origin: [
      "https://paisley-highland-games-frontend.onrender.com",
      "http://localhost:5173"
    ],
    credentials: true
  })
);

// routes
app.use("/api/events", eventsRoutes);
app.use("/api/games", gamesRoutes);
app.use("/api/users", usersRoutes);

// port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`backend running on port ${PORT}`);
});
