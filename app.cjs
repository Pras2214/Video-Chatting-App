const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/mydatabase");
const db = mongoose.connection;

// Check if connection is successful
// db.once("open", () => {
//   console.log("Connected to MongoDB database");
// });

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});
// Rtc Examples
const APP_ID = "eda4b076ae714a89a420adbfae0167fa";
const CHANNEL = "main";
const TOKEN =
  "007eJxTYFDnNNy/uD+sUU/cq3/F7zvL0lwYTyludOLIfmUx/fv+eVsUGFJTEk2SDMzNElPNDU0SLSwTTYwMElOS0hJTDQzNzNMS93FopjUEMjJ83WDHysgAgSA+C0NuYmYeAwMAJkkfaA==";

  
  const formDataSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
  });

  const FormDataModel = mongoose.model("FormData", formDataSchema);
  
  app.post("/signupData", async (req, res) => {
    try {
      const newFormData = new FormDataModel(req.body);
      
      // Save the document to the database
      await newFormData.save();
      
      console.log("Form data saved successfully");
      
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

app.get("/data", (req, res) => {
  const dataToSend = {
    TOKEN,
    APP_ID,
    CHANNEL,
  };
  res.json(dataToSend);
});

app.get("/sendConfirmation", (req, res) => {
  res.json(userConfirmed);
});

app.listen(3000, () => {
  console.log("Listening to the port 5173");
});
