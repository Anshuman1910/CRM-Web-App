const User = require('../models/User');
const { validationResult } = require('express-validator');

//@route GET api/users
//@desc Get al users
//@access Private (admin only)

const getAllUsers = async (req, res) => {
    try {
        // Fetch users from the database
        const users = await User.find().select('-password');

        // Filter out admin users
        const nonAdminUsers = users.filter(user => !user.isAdmin);

        // Send the non-admin users to the frontend
        res.json(nonAdminUsers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


//@route GET api/users/:id
//@desc Get user by ID
//@access Private

const getUserById = async (req,res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if(!user) {
            return res.status(400).json({msg: 'User not found'});
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId'){
            return res.status(404).json({ msg: 'User not found'});
        }
        res.status(500).send('Server Error');
    }
};

//@route PUT api/users/:id
//@desc Update user by ID
//@access Private

const updateUserRole = async (req, res) => {
    const { id } = req.params; // Get the activity ID from the request parameters
    const { role } = req.body; // Get the status from the request body
  
    try {
      // Find the user by ID
      let user = await User.findById(id);
  
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      // Update the user's role
      user.role = role;
  
      // Save the updated user
      await user.save();
  
      res.json({ msg: 'User role updated successfully', user });
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'User not found' });
      }
      res.status(500).send('Server Error');
    }
  };
  
//@route DELETE api/users/:id
//@desc Delete user by ID
//@access Private 

const deleteUser = async (req, res) => {
    try {
        let user = await User.findOne({ _id: req.params.id });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        await User.findOneAndDelete({ _id: req.params.id });

        res.json({ msg: 'User removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(500).send('Server Error');
    }
};
//@route GET api/users/current 
//@desc Get current user
//@access Private

const getCurrentUser = async (req,res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    updateUserRole,
    deleteUser,
    getCurrentUser,
};