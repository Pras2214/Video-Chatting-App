const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const {
  RtcTokenBuilder,
  RtmTokenBuilder,
  RtcRole,
  RtmRole,
} = require("agora-access-token");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});
// Rtc Examples
const APP_ID = "eda4b076ae714a89a420adbfae0167fa";
const APP_CERIFICATE = "e84437506bc148c588e815fc5eab8d62";
const CHANNEL = "main";
const uid = 2882341273;
const role = RtcRole.PUBLISHER;

// IMPORTANT! Build token with either the uid or with the user account. Comment out the option you do not want to use below.

// Build token with uid
const TOKEN = RtcTokenBuilder.buildTokenWithUid(
  APP_ID,
  APP_CERIFICATE,
  CHANNEL,
  uid,
  role
);
console.log("Token With Integer Number Uid: " + TOKEN);

// Build token with user account
// const tokenB = RtcTokenBuilder.buildTokenWithAccount(appID, appCertificate, channelName, account, role, privilegeExpiredTs);
// console.log("Token With UserAccount: " + tokenB);
// Readme

app.get("/data", (req, res) => {
  const dataToSend = {
    TOKEN,
    APP_ID,
    CHANNEL,
    uid,
  };
  res.json(dataToSend);
});

app.listen(3000, () => {
  console.log("Listening to the port 5173");
});
