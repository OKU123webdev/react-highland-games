// import dependencies
import express from "express";
import User from "../models/users.js";

const router = express.Router();

// sync user data
router.post('/sync', async (req, res) => {
  try {
    const { auth0_id, firstname, lastname, role } = req.body;
    let user = await User.findOne({ auth0_id });
    
    if (!user) {
      user = new User({ auth0_id, firstname, lastname, role });
      await user.save();
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET USER ROLE BY AUTH0 ID
router.get('/role', async (req, res) => {
  try {
    const auth0Id = req.query.auth0Id; 
    const user = await User.findOne({ auth0_id: auth0Id });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ role: user.role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// REGISTER NEW USER
router.post("/register", async (req, res) => {
  try {
    if ("confirmPassword" in req.body) {
      delete req.body.confirmPassword;
    }

    const newUser = new User(req.body);
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET ALL USERS
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

export default router;