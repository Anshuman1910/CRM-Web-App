const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const multer = require('multer');
const upload = multer();


// @route   POST api/auth/register
// @desc    Register user
// @access  Public

router.post(
    '/register',upload.none(),authController.registerUser
);

// @route   POST api/auth/login
// @desc    Login user & get token
// @access  Public

router.post(
    '/login',upload.none(),authController.loginUser
);

// @route   POST api/auth/verify
// @desc    Verify token
// @access  Private

router.post('/verify', authController.verifyToken);

router.post('/admin/register',upload.none(), authController.registerAdmin);
router.post('/admin/login', authController.loginAdmin);

module.exports = router;