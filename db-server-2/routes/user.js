const express = require("express");
const User = require("../models/user");
const { authenticate, authorizeAdmin } = require("../utils/auth");

const router = express.Router();

router.use(authenticate);
router.use(authorizeAdmin);

router.get("/getUsers", async (req, res) => {
  try {
    const users = await User.find({ role: "User" });
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users with role 'User' found",
      });
    }

    res.status(200).json({
      success: true,
      data: users,
      message: "Users retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving users",
      error: error.message,
    });
  }
});

router.post("createUser/", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.json({ message: "User created successfully", newUser });
  } catch (error) {
    res.status(500).json({ error: "Error creating user" });
  }
});

router.put("updateUser/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedUser || { message: "User not found" });
  } catch (error) {
    res.status(500).json({ error: "Error updating user" });
  }
});

router.delete("/deleteUser/:id", async (req, res) => {
  try {
    console.log("Attempting to delete user with ID:", req.params.id);
    console.log("Authenticated user:", req.user);
    
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    
    if (!deletedUser) {
      console.log("User not found with ID:", req.params.id);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    
    console.log("Successfully deleted user:", deletedUser);
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: deletedUser,
    });  
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }
});

module.exports = router;
