# Firebase Setup Guide

To enable cloud storage and real-time synchronization for the team formation system, you need to set up a Firebase project.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `dwdm-team-selection` (or any name you prefer)
4. Follow the setup wizard (you can disable Google Analytics if not needed)

## Step 2: Create a Realtime Database

1. In your Firebase project, go to "Build" → "Realtime Database"
2. Click "Create Database"
3. Choose a location (preferably closest to India, like `asia-southeast1`)
4. Start in **Test mode** for now (we'll secure it later)

## Step 3: Get Your Firebase Configuration

1. In Firebase Console, go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click the web icon `</>` to add a web app
4. Register your app with a nickname (e.g., "DWDM Team App")
5. Copy the `firebaseConfig` object

## Step 4: Update firebase-config.js

Replace the configuration in `firebase-config.js` with your actual Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

## Step 5: Set Database Rules (Important!)

In Realtime Database → Rules tab, use these rules:

```json
{
  "rules": {
    "students": {
      ".read": true,
      ".write": true
    },
    "teams": {
      ".read": true,
      ".write": true
    }
  }
}
```

**Note:** These rules allow anyone to read/write. For production, you should add authentication.

## Step 6: Deploy Your Application

### Option 1: Firebase Hosting (Recommended)

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init hosting
   ```
   - Select your Firebase project
   - Set public directory to current folder (`.`)
   - Configure as single-page app: No
   - Don't overwrite index.html

4. Deploy:
   ```bash
   firebase deploy
   ```

5. Share the hosting URL with your classmates and professor!

### Option 2: Any Web Hosting

You can upload all files to any web hosting service:
- GitHub Pages
- Netlify
- Vercel
- Your college server

Just make sure all files are uploaded together.

## Sharing with Professor

Once deployed, share the URL with:
1. Your classmates - so they can form teams
2. Your professor - so they can export the final Excel file

The professor can visit the URL anytime and click **[EXPORT_EXCEL]** to download the current team list.

## Features

✅ **Real-time sync** - All changes are instantly visible to everyone
✅ **Cloud storage** - Data persists across devices
✅ **Add missing students** - Students can add themselves if not in the list
✅ **Export to Excel** - Professor can export anytime
✅ **No login required** - Simple and easy to use

## Troubleshooting

If Firebase is not working:
- The app will automatically fall back to localStorage
- Data will be stored locally in the browser
- You'll need to manually collect data from each student

## Security Note

The current setup allows anyone with the URL to modify data. For a production environment, you should:
1. Add Firebase Authentication
2. Implement proper security rules
3. Add admin roles for the professor

For a class project with a deadline, the current setup should work fine!
