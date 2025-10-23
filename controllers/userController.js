import User from "../models/userModel.js";

export const seedUsers = async (req, res) => {
  try {
    const users = [];
    for (let i = 1; i <= 100; i++) {
      users.push({
        name: `Yopmail User ${i}`,
        email: `user${i}@yopmail.com`,
        age: 20 + (i % 10),
      });
    }
    await User.insertMany(users); // Insert multiple user documents into the database
    res.status(201).json({ message: "Dummy users inserted!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Controller to fetch paginated users from the database.
 *
 * Endpoint example: GET /api/users?page=2&limit=5
 *
 * Query Parameters:
 * - page: Current page number (default: 1)
 * - limit: Number of users per page (default: 10)
 *
 * Response JSON:
 * {
 *   totalUsers: 50,       // Total number of users in DB
 *   totalPages: 5,        // Total pages = ceil(totalUsers / limit)
 *   currentPage: 2,       // Current page number
 *   users: [ ... ]        // Array of user objects for this page
 * }
 */
export const getPaginatedUsers = async (req, res) => {
  try {
    // query() grab the param from URL and returns a string
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    // Formula: (page - 1) * limit
    // Example: page=2, limit=10 → skip=10
    const skip_n = (page - 1) * limit;
    // - .find() → fetch all users
    // - .skip(skip) → skip the first 'skip' records
    // - .limit(limit) → return only 'limit' records
    const users = await User.find().skip(skip_n).limit(limit);
    // Count total number of users
    const total = await User.countDocuments();

    // Send paginated response
    res.status(200).json({
      totalUsers: total, // Total number of users in DB
      totalPages: Math.ceil(total / limit), // Total pages calculation ceil is used to round up
      currentPage: page, // Current page number
      users, // Array of user objects
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
