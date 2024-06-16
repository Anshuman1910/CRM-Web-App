const express = require('express');
const router = express.Router();
const { check } =  require('express-validator');
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');
const adminAuth = require('../middlewares/adminAuth');


// @route   GET api/users/current
// @desc    Get current user
// @access  Private
router.get('/current', userController.getCurrentUser);// add auth 

// @route   GET api/users
// @desc    Get all users
// @access  Private (admin only)
router.get('/', userController.getAllUsers);// INCLUDE adminAuth in parameter

// @route   GET api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', userController.getUserById); // INCLUDE auth in parameter

// @route   PUT api/users/:id
// @desc    Update user role by ID
// @access  Private
router.put('/:id',userController.updateUserRole);

// @route   DELETE api/users/:id
// @desc    Delete user by ID
// @access  Private
router.delete('/:id', userController.deleteUser);// add auth



module.exports = router;