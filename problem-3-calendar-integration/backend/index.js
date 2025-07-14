require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const frontendPath = path.join(__dirname, "../frontend");
app.use(express.static(frontendPath));

app.use(cors());
app.use(bodyParser.json());

// Load env vars
const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  REFRESH_TOKEN,
} = process.env;

// Debug log for env vars (optional)
console.log("🟡 Loaded ENV:", {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
});

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);

if (REFRESH_TOKEN) {
  oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
}

const SCOPES = ["https://www.googleapis.com/auth/calendar"];
const calendar = google.calendar({ version: "v3", auth: oauth2Client });

let syncToken = null;

// Routes

app.get("/authUrl", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });
  res.json({ url });
});

app.get("/oauth2callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send("Missing code parameter");

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    if (tokens.refresh_token) {
      const envPath = path.resolve(__dirname, "./.env");
      let envContent = fs.existsSync(envPath)
        ? fs.readFileSync(envPath, "utf-8")
        : "";

      if (envContent.match(/^REFRESH_TOKEN=.*$/m)) {
        envContent = envContent.replace(
          /^REFRESH_TOKEN=.*$/m,
          `REFRESH_TOKEN=${tokens.refresh_token}`
        );
      } else {
        envContent += `\nREFRESH_TOKEN=${tokens.refresh_token}`;
      }

      fs.writeFileSync(envPath, envContent);
      console.log("✅ REFRESH_TOKEN saved to .env");
    }

    res.send("✅ Auth success! You can close this tab and return to the app.");
  } catch (error) {
    console.error("Token error:", error);
    res.status(500).send("❌ Auth failed");
  }
});

app.get("/events", async (req, res) => {
  try {
    const params = {
      calendarId: "primary",
      maxResults: 50,
      singleEvents: true,
      orderBy: "startTime",
      timeMin: new Date().toISOString(),
    };
    if (syncToken) params.syncToken = syncToken;

    const response = await calendar.events.list(params);
    syncToken = response.data.nextSyncToken || syncToken;

    res.json(response.data.items);
  } catch (error) {
    if (error.code === 410) {
      syncToken = null;
      return res.status(410).json({ error: "Sync token expired" });
    }
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

app.post("/events", async (req, res) => {
  const { summary, startTime, endTime } = req.body;
  try {
    const event = {
      summary,
      start: {
        dateTime: startTime,
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: endTime,
        timeZone: "Asia/Kolkata",
      },
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
    });
    res.json(response.data);
  } catch (error) {
    console.error("Add failed:", error);
    res.status(500).json({ error: "Failed to add event" });
  }
});

app.put("/events", async (req, res) => {
  try {
    const list = await calendar.events.list({
      calendarId: "primary",
      maxResults: 1,
      orderBy: "startTime",
      singleEvents: true,
      timeMin: new Date().toISOString(),
    });

    const event = list.data.items[0];
    if (!event) return res.status(404).json({ error: "No events to update" });

    event.summary += " (Updated)";
    const response = await calendar.events.update({
      calendarId: "primary",
      eventId: event.id,
      requestBody: event,
    });

    res.json(response.data);
  } catch (error) {
    console.error("Update failed:", error);
    res.status(500).json({ error: "Failed to update event" });
  }
});

app.delete("/events", async (req, res) => {
  try {
    const list = await calendar.events.list({
      calendarId: "primary",
      maxResults: 1,
      orderBy: "startTime",
      singleEvents: true,
      timeMin: new Date().toISOString(),
    });

    const event = list.data.items[0];
    if (!event) return res.status(404).json({ error: "No events to delete" });

    await calendar.events.delete({
      calendarId: "primary",
      eventId: event.id,
    });

    res.json({ message: "Event deleted" });
  } catch (error) {
    console.error("Delete failed:", error);
    res.status(500).json({ error: "Failed to delete event" });
  }
});

// Fallback route
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
