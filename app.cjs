require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/mydatabase");
const db = mongoose.connection;

db.once("open", () => {
  console.log("Connected to MongoDB database");
});

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

const APP_ID = process.env.APP_ID;
const CHANNEL = process.env.CHANNEL;
const TOKEN = process.env.TOKEN;


const formDataSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  uid: String,
});

const FormDataModel = mongoose.model("FormData", formDataSchema);

app.post("/signupData", async (req, res) => {
  try {
    const newFormData = new FormDataModel(req.body);

    // Save the document to the database
    await newFormData.save();

    // Respond with a success message
    res.status(200).send("Form data saved successfully");
  } catch (error) {
    // Handle errors
    console.error("Error saving form data:", error);
    res.status(500).send("Internal server error");
  }
});

let mongoDBData,
  userConfirmed = false;
app.post("/loginData", async (req, res) => {
  try {
    const formData = req.body;
    const { username, password } = formData;
    mongoDBData = await FormDataModel.findOne({ username });
    if (
      mongoDBData &&
      mongoDBData.username === username &&
      mongoDBData.password === password
    ) {
      userConfirmed = true;
    } else {
      userConfirmed = false;
    }
  } catch (error) {
    console.error(error);
  }
});

// Endpoint to update the UID for a user
app.post("/updateUid", async (req, res) => {
  try {
    const { username, uid } = req.body;
    await FormDataModel.findOneAndUpdate({ username }, { uid });
    res.status(200).send("UID updated successfully");
  } catch (error) {
    console.error("Error updating UID:", error);
    res.status(500).send("Internal server error");
  }
});

// Endpoint to get username by UID
app.get("/getUserByUid", async (req, res) => {
  try {
    const { uid } = req.query;
    const user = await FormDataModel.findOne({ uid });
    if (user) {
      res.json({ username: user.username });
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Error fetching user by UID:", error);
    res.status(500).send("Internal server error");
  }
});

app.get("/data", (req, res) => {
  const dataToSend = {
    TOKEN,
    APP_ID,
    CHANNEL,
  };
  res.json(dataToSend);
});

app.get("/sendConfirmation", (req, res) => {
  res.json({
    userConfirmed,
    username: userConfirmed ? mongoDBData?.username : null,
    uid: userConfirmed ? mongoDBData?.uid : null
  });
});

app.listen(3000, () => {
  console.log("Listening to the port 3000");
});
