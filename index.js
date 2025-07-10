require("dotenv").config();
const express = require("express");
const axios = require("axios");
const path = require("path");
const app = express();

// Load private token from environment safely
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

if (!PRIVATE_APP_ACCESS) {
  console.error("Error: PRIVATE_APP_ACCESS environment variable is not set.");
  process.exit(1);
}

// View engine
app.set("view engine", "pug");

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Homepage route
app.get("/", (req, res) => {
  res.render("home", { title: "Home | HubSpot APIs" });
});

// Localhost listener
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
