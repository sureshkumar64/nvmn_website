import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import admin from '../config/firebaseAdmin.js'; // Firebase Admin SDK instance

/**
 * @desc    Authenticate user with Firebase phone auth & get token
 * @route   POST /api/users/login
 * @access  Public
 */
const authUser = asyncHandler(async (req, res) => {
  // Try to get token from Authorization header (Bearer <token>)
  let idToken;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    idToken = authHeader.split(' ')[1];
  } else if (req.body.idToken) {
    // Fallback to body (for backward compatibility)
    idToken = req.body.idToken;
  }

  if (!idToken) {
    res.status(400);
    throw new Error('No Firebase token provided');
  }

  try {
    // Verify Firebase token
    const decoded = await admin.auth().verifyIdToken(idToken);

    const phone = decoded.phone_number;

    if (!phone) {
      res.status(400);
      throw new Error('Invalid token: No phone number found');
    }

    // Check if user exists
    let user = await User.findOne({ phone });

    // If not, create a new one
    if (!user) {
      user = await User.create({
        name: 'New User', // or req.body.name (if sent from frontend)
        phone,
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      phone: user.phone,
      isAdmin: user.isAdmin,
      token: generateToken(user._id), // Your JWT for backend auth
    });
  } catch (error) {
    console.error(error);
    res.status(401);
    throw new Error('Invalid Firebase token');
  }
});

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      phone: user.phone,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * @desc    Register new user manually (optional if using only Firebase login)
 * @route   POST /api/users
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;

  const userExist = await User.findOne({ phone });
  if (userExist) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    phone,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      phone: user.phone,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { name, phone } = req.body;

    user.name = name || user.name;
    user.phone = phone || user.phone;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      phone: updatedUser.phone,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// 🔹 Remaining admin/user management functions unchanged
const getUsers = asyncHandler(async (req, res) => {
  
  const users = await User.find({});
  res.json(users);
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.remove();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    const { name, phone, isAdmin } = req.body;
    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.isAdmin = isAdmin;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      phone: updatedUser.phone,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};