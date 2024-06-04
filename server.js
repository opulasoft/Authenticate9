require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { sequelize } = require("./config/db.js"); // Sequelize instance for database connection

const userRoutes = require("./Routes/UserRoutes.js"); // User routes
const spamRoutes = require("./Routes/SpamRoutes.js"); // Spam routes
const contactRoutes = require("./Routes/ContactRoutes.js"); // Contact routes
const searchRoutes = require("./Routes/SearchRoutes.js"); // Search routes

const randomData = require("./generateSampleData.js"); // Generate random data


app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cors());  // to enable cors

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/spam", spamRoutes);
app.use("/api/v1/contact", contactRoutes);
app.use("/api/v1/search", searchRoutes);

const port = process.env.PORT || 3000;

// Route handler 
app.get("/", (req, res) => {
    res.status(200).json("Hello from Root!"); 
  });
  // check database connectivity
  sequelize
    .sync() // Sync database models
    .then(async () => {
      console.log("Database Connected sucessfully."); 
      randomData.generateRandomData();
      // Start server
      app.listen(port, () => {
        console.log(`Server is running on port ${port}`); // Log server start message
      });
    })
    .catch((error) => {
      console.error("Database connection failed:", error); // Log database connection error
    });

module.exports = app;