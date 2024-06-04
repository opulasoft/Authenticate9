const express = require("express"); // Express framework
const router = express.Router(); // Router instance
const searchController = require("../Controllers/SearchController"); // User controller module
const { authenticateToken } = require("../Middleware/auth"); // authentication module


// Route to search contacts by name
router.get("/serachByName", authenticateToken, searchController.searchByName);
// Route to search contacts by number
router.get("/searchByNumber", authenticateToken, searchController.searchByNumber);


module.exports = router; // Exporting the router for use in other modules
