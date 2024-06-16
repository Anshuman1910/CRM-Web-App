const Activity = require('../models/activity');
const mongoose = require('mongoose');

// Controller functions for handling activities

// Create a new activity
const createActivity = async (req, res) => {
    const { userId, title, description } = req.body;
    try {
        
        const newActivity = new Activity({
            userId,
            title,
            description,
            status: "pending" // Initialize status with "pending"
        });

        await newActivity.save();

        res.status(201).json(newActivity);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Get all activities for a specific user
const getAllActivitiesForUser = async (req, res) => {
    const userId = req.params.userId;

    try {
        const activities = await Activity.find({ userId });

        // Sort activities based on pending/completed status
        // activities = sortActivities(activities);

        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update an existing activity
const updateActivity = async (req, res) => {
    const { id } = req.params; // Get the activity ID from the request parameters
    const { status } = req.body; // Get the status from the request body

    try {
        // Find the activity by ID and update its status
        const updatedActivity = await Activity.findByIdAndUpdate(
            id,
            { status },
            { new: true } // This option returns the modified document rather than the original
        );

        // If the activity is not found, return a 404 error
        if (!updatedActivity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        // Return the updated activity
        res.status(200).json(updatedActivity);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete an activity
const deleteActivity = async (req, res) => {
    const { id } = req.params; // Get the activity ID from the request parameters
  
    try {
      // Find the activity by ID and delete it
      const deletedActivity = await Activity.findByIdAndDelete(id);
  
      // If the activity is not found, return a 404 error
      if (!deletedActivity) {
        return res.status(404).json({ message: 'Activity not found' });
      }
  
      // Return a success message
      res.status(200).json({ message: 'Activity deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

// Sort activities based on pending/completed status
const sortActivities = (activities) => {
    const pendingActivities = activities.filter(activity => activity.status === 'pending');
    const completedActivities = activities.filter(activity => activity.status === 'completed');
    return [...pendingActivities, ...completedActivities];
};


module.exports = {
    createActivity,
    getAllActivitiesForUser,
    updateActivity,
    deleteActivity
};
