const connection = require("../config/db.js");
const { success, error } = require("../utils/response.js");

const allUsers = async (req, res) => {
  try {
    const id = req.id;

    const [users] = await connection.execute(
      "SELECT id, name, email FROM users WHERE id != ? AND gender != ? LIMIT 10 OFFSET 0",
      [id, "male"]
    );

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (err) {
    console.error(err);
    return error(res, 500, "Internal Server Error", err.message);
  }
};


const getUsers = async (req, res) => {
    try {
        const { minAge, maxAge, gender } = req.body;
        const id = req.id;

        if (
            typeof minAge !== 'number' ||
            typeof maxAge !== 'number' ||
            typeof gender !== 'string'
        ) {
            return error(res, 400, "Invalid or missing minAge, maxAge, or gender");
        }

        const [users] = await connection.execute(
            "SELECT * FROM users WHERE age BETWEEN ? AND ? AND gender = ? AND id != ? LIMIT 10 OFFSET 0",
            [minAge, maxAge, gender, id]
        );

        if (users.length === 0) {
            return error(res, 404, "No user found");
        }

        return success(res, users, "Users fetched successfully");
    } catch (err) {
        console.error(err);
        return error(res, 500, "Internal Server Error", err.message);
    }
};

const getProfile = async (req, res) => {
    try {
        const id = req.id;

        if (!id) {
            return error(res, 400, "Missing user ID");
        }

        const [profile] = await connection.execute(
            "SELECT * FROM profile_info WHERE user_id = ?",
            [id]
        );

        if (profile.length === 0) {
            return error(res, 404, "No profile info found");
        }

        return success(res, profile[0], "Profile fetched successfully");
    } catch (err) {
        console.error(err);
        return error(res, 500, "Internal Server Error", err.message);
    }
};

// GET: fetch swipeable users (not same gender, not self)
const getUsersSwipe = async (req, res) => {
    try {
        const id = req.id;
        if (!id) {
            return error(res, 401, "Unauthorized: Missing user id");
        }

        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = parseInt(req.query.offset, 10) || 0;

        // Get the gender of the logged-in user
        const [userResult] = await connection.execute(
            "SELECT gender FROM users WHERE id = ? AND gender != ?",
            [id, "male"]
        );

        if (userResult.length === 0) {
            return error(res, 404, "Logged-in user not found");
        }

        const userGender = userResult[0].gender;

        // Fetch other users not of same gender and not self
        const [users] = await connection.execute(
            "SELECT * FROM users WHERE gender != ? AND id != ? LIMIT ? OFFSET ?",
            [userGender, id, limit, offset]
        );

        if (users.length === 0) {
            return error(res, 404, "No more users found");
        }

        return success(res, users, "Users fetched successfully");
    } catch (err) {
        console.error(err);
        return error(res, 500, "Internal Server Error", err.message);
    }
};

const matchUsers = async (req, res) => {
    try {
        const userId = req.id;
        const { likedUserId } = req.body;

        if (!userId || !likedUserId) {
            return error(res, 400, "Missing user ID or liked user ID");
        }

        if (userId === likedUserId) {
            return error(res, 400, "You can't like yourself");
        }

        await connection.execute(
            "INSERT IGNORE INTO user_likes (liker_id, liked_id) VALUES (?, ?)",
            [userId, likedUserId]
        );

        const [match] = await connection.execute(
            "SELECT * FROM user_likes WHERE liker_id = ? AND liked_id = ?",
            [likedUserId, userId]
        );

        const isMatch = match.length > 0;

        return res.status(200).json({
            success: true,
            isMatch,
            message: isMatch ? "It's a match!" : "Like recorded successfully"
        });

    } catch (err) {
        console.error(err);
        return error(res, 500, "Internal Server Error", err.message);
    }
};

const setProfile = async (req, res) => {
  try {
    const userId = req.id; // Assumes token is verified and user ID is attached to request

    const {
      profilePicture,
      height,
      education,
      occupation,
      relationshipStatus,
      lookingFor,
      about,
      location
    } = req.body;

    const insertQuery = `
      INSERT INTO profile_info (
        user_id,
        photo_url,
        height,
        education,
        occupation,
        relationship_status,
        looking_for,
        about_me,
        location
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        photo_url = VALUES(photo_url),
        height = VALUES(height),
        education = VALUES(education),
        occupation = VALUES(occupation),
        relationship_status = VALUES(relationship_status),
        looking_for = VALUES(looking_for),
        about_me = VALUES(about_me),
        location = VALUES(location),
        updated_at = CURRENT_TIMESTAMP
    `;

    const values = [
      userId,
      profilePicture,
      height,
      education,
      occupation,
      relationshipStatus,
      lookingFor,
      about,
      location
    ];

    await connection.execute(insertQuery, values);

    res.json({ success: true, message: 'Profile updated successfully.' });
  } catch (error) {
    console.error('Error saving profile:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

module.exports = { getUsers, getProfile, getUsersSwipe, matchUsers, allUsers, setProfile };

