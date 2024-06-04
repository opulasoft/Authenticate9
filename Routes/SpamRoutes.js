//declare all required modules
const express = require("express");
const router = express.Router();
const spamController = require("../Controllers/SpamController.js");
const { authenticateToken } = require("../Middleware/auth"); // authentication module

router.post("/add", authenticateToken, spamController.addSpam); // route to add the number to the spam list by user

router.get("/fetch", authenticateToken, spamController.fetchSpam); // route to get the spam marked by user

router.get("/getall", authenticateToken, spamController.getAllSpammers); // route to get the spam marked by all user

module.exports = router;
