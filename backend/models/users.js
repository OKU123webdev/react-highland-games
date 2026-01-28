import mongoose from "mongoose"; 

// USER SCHEMA
const userSchema = new mongoose.Schema({
  // auth0 user ID
  auth0_id: { 
    type: String,
    required: true,
    unique: true
  },
  // user names
  firstname: { 
    type: String,
    required: true,
  },
  lastname: { 
    type: String,
    default: "Unknown"
  },
  // user type (admin or participant)
  role: { 
    type: String, 
    enum: ["participant", "admin"],
    default: "participant", 
  }
}, { timestamps: true });

const User = mongoose.model("User", userSchema); 
export default User;