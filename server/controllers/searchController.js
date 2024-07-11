const User = require("../models/User");
const { success, error } = require("../utils/responseWrapper");

const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        console.log("query @ searchController", query )

        if (!query) {
            return res.send(error(400, 'No user found!'));
        }

        // Use regex to find users with names that match the query
        const users = await User.find({
            name: { $regex: query, $options: 'i' } // 'i' makes the search case-insensitive
        });
        console.log("res @searchController", res);
        return res.send(success(200, { users }));
        
    } catch (e) {
        console.log("res error @searchController", e);
        return res.send(error(500, e.message));
    }
};

module.exports = {
    searchUsers
};