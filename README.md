# Problem 2 – Parallel Audio Stream Separation (Browser)

## Overview

This project demonstrates a solution to capture and separate simultaneous system audio (via screen capture) and microphone audio in a Chrome browser. The challenge addressed here is the echo or audio bleed caused when the microphone picks up system audio during simultaneous capture.

Using the Web MediaStream APIs and the Web Audio API, this project captures both audio sources and applies real-time audio processing techniques to isolate and separate the microphone audio from the system audio, reducing echo and overlap.

## Key Features

- Capture system audio via `getDisplayMedia({ audio: true })`
- Capture microphone audio via `getUserMedia({ audio: true })`
- Real-time audio processing using Web Audio API nodes
- Basic signal processing algorithms to minimize echo/bleed
- Browser-based, runs entirely in Chrome without additional software

## How It Works

1. The app requests permissions to access both the microphone and system audio.
2. It creates an `AudioContext` and connects the audio streams to separate nodes.
3. Applies adaptive filtering / echo cancellation techniques to reduce microphone capture of system audio.
4. Outputs the cleaned audio streams separately for further use or playback.

## Usage

1. Open `index.html` in a Chrome browser.
2. Click the button to start capturing audio streams.
3. Follow the prompts to allow microphone and screen capture permissions.
4. The app will process and separate the audio streams in near real-time.

## Requirements

- Google Chrome (latest recommended)
- Microphone and system audio access permissions

## Notes

- Echo cancellation is a complex signal processing problem; this demo uses a simplified approach for demonstration.
- For best results, use headphones to minimize actual physical echo.

## File Structure
```bash
/problem-2-audio-separation
├── index.html # UI for starting audio capture
├── index.js # Core logic for audio capture and separation
├── styles.css # Optional UI styling
```

# Problem 3 Calendar Integration 

I integrated Google Calendar into a full-stack web application by implementing OAuth2 authentication and calendar event management. I started by creating OAuth credentials in the Google Cloud Console and used a Node.js script to securely generate a refresh token. All sensitive information such as client ID, client secret, redirect URI, and refresh token are stored in a .env file and excluded from version control. The backend, built with Express and the Google APIs client library, handles authentication and provides RESTful endpoints to list, add, update, and delete calendar events. The frontend communicates with these endpoints to allow users to manage their Google Calendar events seamlessly. This setup ensures secure token handling, proper authorization flow, and full calendar functionality within the app.

### Project Structure

```bash
problem-3-calendar-integration/
├── backend/
│   ├── index.js             # Express server with Google Calendar API logic
│   ├── generate_token.js    # Script to generate refresh token via OAuth
│   ├── .env                 # Environment variables (not committed to Git)
│   └── package.json
├── frontend/                # Static frontend (optional or replaceable)
│   └── index.html
├── .gitignore
└── README.md
```

### Prerequisites

Node.js installed

Google Cloud project with:

OAuth 2.0 Client ID credentials

Authorized redirect URI: http://localhost:3000/oauth2callback

## Setup Instructions

1. Clone the Repository
   
```bash
git clone <repo-url>
cd problem-3-calendar-integration
```

2. Install Backend Dependencies
   
```bash
cd backend
npm install
```

3. Create .env in backend/ Directory
   
```env   
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/oauth2callback
REFRESH_TOKEN=your-refresh-token
```
Replace placeholders with actual credentials from Google Cloud Console.

## Get Google OAuth Refresh Token
If you don’t have a REFRESH_TOKEN yet:

```bash
node generate_token.js
```

Visit the link shown in terminal.

Authorize the app.

Copy the code from the browser and paste it into the terminal.

Copy the generated refresh token and update your .env file.

## Run the App
```bash
node index.js
Your backend will be running at:
```
http://localhost:3000
