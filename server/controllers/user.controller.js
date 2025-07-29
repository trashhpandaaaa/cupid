const connection = require("../config/db.js");
const { success, error } = require("../utils/response.js");

// POST: filter by age & gender range
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

// GET: fetch profile info of logged-in user
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
            "SELECT gender FROM users WHERE id = ?",
            [id]
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

module.exports = { getUsers, getProfile, getUsersSwipe };

