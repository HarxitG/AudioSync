const { google } = require("googleapis");
const readline = require("readline");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } =
  process.env;

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);

const SCOPES = ["https://www.googleapis.com/auth/calendar"];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: SCOPES,
  prompt: "consent",
});

console.log("\n Authorize this app by visiting this URL:\n", authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("\n Enter the code from that page here: ", async (code) => {
  rl.close();
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log("\n Your Refresh Token:\n", tokens.refresh_token);
    console.log(
      "\n Save this in your .env as:\nREFRESH_TOKEN=",
      tokens.refresh_token
    );
  } catch (error) {
    console.error("\n Error retrieving access token:", error.message);
  }
});
