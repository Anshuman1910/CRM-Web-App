const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const multer = require('multer');
const upload = multer();

//Route - /api/activities

// Route to create a new activity
router.post('/add', upload.none(),activityController.createActivity);

// Route to get all activities for a user
router.get('/:userId', activityController.getAllActivitiesForUser);

// Route to update an activity's status using activity id
router.put('/update/:id',upload.none(), activityController.updateActivity);

// Route to delete an activity
router.delete('/delete/:id', activityController.deleteActivity);

module.exports = router;
