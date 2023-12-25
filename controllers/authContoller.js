import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

// @desc    Login/Auth user & get token
// @endpoint   POST /api/users/auth
// @access  Public

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const { _id, name, email } = user;

    generateToken(res, _id);

    res.json({
      _id: _id,
      name: name,
      email:email,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});


// @desc    Register a new user
// @endpoint   POST /api/users
// @access  Public

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    const { _id, name, email } = user;
    generateToken(res, _id);

    res.status(201).json({
      _id: _id,
      name: name,
      email: email,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Logout user / clear cookie
// @endpoint   POST /api/users/logout
// @access  Public

const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @endpoint   GET /api/users/profile
// @access  Protected

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @endpoint   PUT /api/users/profile
// @access  Protected

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

     if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

   if(updatedUser){
     res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
   }
   else {
     res.status(500);
    throw new Error('Something went wrong');
   }
    

  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
};
