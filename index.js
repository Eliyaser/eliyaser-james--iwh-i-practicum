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
// Contacts route
app.get("/contacts", async (req, res) => {
  const url =
    "https://api.hubspot.com/crm/v3/objects/contacts?properties=pet_name,hobby,firstname,lastname,email,phone,website&limit=10&archived=false";
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };

  try {
    const resp = await axios.get(url, { headers });
    const contacts = resp.data.results;
    console.log("Contacts fetched successfully:", contacts);

    res.render("contacts", {
      title: "Contacts | HubSpot APIs",
      data: contacts,
    });
  } catch (error) {
    console.error("Error fetching contacts:", error.message);

    res.status(500).send("Error fetching contacts. Check server logs.");
  }
});
app.get("/contacts/update/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const url = `https://api.hubspot.com/crm/v3/objects/contacts/${id}?properties=pet_name,hobby,firstname,lastname,email,phone,website&archived=false`;
    const headers = {
      Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
      "Content-Type": "application/json",
    };

    const resp = await axios.get(url, { headers });
    const contact = resp.data;

    res.render("update", {
      title: "Update Contact | HubSpot APIs",
      contact: contact,
    });
  } catch (error) {
    console.error("Error fetching contact:", error.message);
    res.status(500).send("Error fetching contact. Check server logs.");
  }
});

app.post("/contacts/update/:id", async (req, res) => {
  const id = req.params.id;
  const email = req.body.email;
  const updateContacts = `https://api.hubspot.com/crm/v3/objects/contacts/${email}?idProperty=email&archived=false`;
  const update = {
    properties: {
      firstname: req.body.firstname,
      pet_name: req.body.pet_name,
      hobby: req.body.hobby,
    },
  };
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };

  try {
    const resp = await axios.patch(updateContacts, update, { headers });
    const datas = resp.data;
    console.log("Contact updated successfully:", datas);
    res.redirect(`/contacts`);
  } catch (error) {
    console.error("Error updating contact:", error.message);
  }
});

// Localhost listener
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
