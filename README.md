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
