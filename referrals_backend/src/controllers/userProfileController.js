// controllers/userProfileController.js
const UserProfile = require("../models/ReferralUserInfo");


exports.createProfile = async (req, res, next) => {
  try {
    // Validate input data
    const {
      full_name,
      email,
      headline,
      about,
      age,
      years_of_exp,
      phone_number,
      country,
      city,
      education_id,
      github_url,
      portfolio_url,
      linkedin_url,
      resume_url,
      other_url,
      skills,
      visibility,
    } = req.body;

    // Check required fields
    if (!full_name || !email || !visibility) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    // Create a new profile
    const newProfile = new UserProfile({
      full_name,
      email,
      headline,
      about,
      age,
      years_of_exp,
      phone_number,
      country,
      city,
      education_id,
      github_url,
      portfolio_url,
      linkedin_url,
      resume_url,
      other_url,
      skills,
      visibility,
    });

    // Save the profile to the database
    const savedProfile = await newProfile.save();

    res.status(201).json(savedProfile);
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      const error = new Error("User ID is missing");
      error.status = 400; // Bad Request
      return next(error); // Pass the error to the error handling middleware
    }

    const userId = req.user.id;
    const profileData = req.body; // Ensure profileData is from request body

    // Update profile in the database
    const updatedProfile = await UserProfile.findOneAndUpdate(
      { user: userId },
      { $set: profileData },
      { new: true, upsert: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(updatedProfile);
  } catch (err) {
    // Pass any other errors to the error handling middleware
    res.status(500).json({ message: "Error updating profile", error });
    next(err);
  }
};

exports.getProfileDetails = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      const error = new Error("User ID is missing");
      error.status = 400; // Bad Request
      return next(error); // Pass the error to the error handling middleware
    }

    const userId = req.user.id;
    console.log("USer ID: ", userId);
    // Fetch profile details from the database
    const profile = await UserProfile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(profile);
  } catch (err) {
    // Pass any other errors to the error handling middleware
    res.status(500).json({ message: "Error fetching profile details", error });
    next(err);
  }
};

exports.updateVisibility = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      const error = new Error("User ID is missing");
      error.status = 400; // Bad Request
      return next(error); // Pass the error to the error handling middleware
    }

    const userId = req.user.id;
    const { visibility } = req.body;

    const profile = await UserProfile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Ensure all required fields are filled before making the profile visible
    if (visibility && !profile.full_name) {
      return res.status(400).json({
        message:
          "All required fields must be filled before making the profile visible",
      });
    }

    profile.visibility = visibility;
    await profile.save();

    res
      .status(200)
      .json({ message: "Visibility updated successfully", visibility });
  } catch (error) {
    res.status(500).json({ message: "Error updating visibility", error });
  }
};


exports.getVisibilityStatus = async (req, res, next) => {
  try {
    // Determine the user ID from req.user or query parameters
    const userId = req.user?.id || req.query.id || req.params.id;

    //console.log("USER ID: ", userId);

    // Check if a user ID is available
    if (!userId) {
      const error = new Error("User ID is missing");
      error.status = 400; // Bad Request
      return next(error); // Pass the error to the error handling middleware
    }

    // Fetch the user profile using the user ID
    const profile = await UserProfile.findOne({ user: userId });

    // Handle case where profile is not found
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Return the visibility status
    res.status(200).json({ visibility: profile.visibility });
  } catch (error) {
    // Handle any other errors
    res.status(500).json({ message: "Error fetching visibility status", error });
  }
};

exports.getProfiles = async (req, res, next) => {
  const { visibility, experience, skills } = req.query;

  try {
    const query = {
      visibility: visibility || { $exists: true },
      ...(experience && { years_of_exp: experience }),
      ...(skills && { skills: { $in: skills.split(",") } }),
    };

    const profiles = await UserProfile.find(query);

    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profiles", error });
  }
};

exports.getProfileById = async (req, res) => {
  const profileId = req.params.id;

  try {
    const profile = await UserProfile.findById(profileId);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Filter the response based on visibility or category
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile by ID", error });
  }
};

exports.discardProfile = async (req, res) => {
  const userId = req.user.id;
  const profileId = req.params.id;

  try {
    const profile = await UserProfile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    if (!profile.discardedProfiles.includes(profileId)) {
      profile.discardedProfiles.push(profileId);
      await profile.save();
    }

    res.status(200).json({ message: "Profile discarded successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error discarding profile", error });
  }
};
