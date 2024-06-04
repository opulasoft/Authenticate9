const express = require("express");
const router = express.Router();
const contactController = require("../Controllers/ContactController"); // contact controller module
const { authenticateToken } = require("../Middleware/auth"); // authentication module

// Route to add a new contact of user
router.post("/add", authenticateToken, contactController.addContact);

// Route to get all contacts of user
router.get("/fetch", authenticateToken, contactController.fetchContact);

module.exports = router;