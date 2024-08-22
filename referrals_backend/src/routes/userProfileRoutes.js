const express = require('express');
const userProfileController = require('../controllers/userProfileController');
const auth = require('../middlewares/auth');
const router = express.Router();

// POST profiles - Create a new profile
router.post('/', auth, userProfileController.createProfile);

// Update user profile
router.put('/', auth, userProfileController.updateProfile);

// Get user profile details
router.get('/', auth, userProfileController.getProfileDetails);

// Update visibility status
router.put('/visibility', auth, userProfileController.updateVisibility);

// Get visibility status
router.get('/visibility', auth, userProfileController.getVisibilityStatus);

// Get profiles by criteria
router.get('/', auth, userProfileController.getProfiles);

// Get profile by ID
router.get('/:id', auth, userProfileController.getProfileById);

// Discard a profile
router.post('/:id/discard', auth, userProfileController.discardProfile);

module.exports = router;
