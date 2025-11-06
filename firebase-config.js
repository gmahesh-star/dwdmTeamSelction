// Firebase Configuration
// This is a public configuration - it's safe to expose these keys
const firebaseConfig = {
    apiKey: "AIzaSyBYgaQ-KlvtDcUUbWobUThzxS6_3X7O40w",
    authDomain: "dwdm-team-selection.firebaseapp.com",
    databaseURL: "https://dwdm-team-selection-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "dwdm-team-selection",
    storageBucket: "dwdm-team-selection.firebasestorage.app",
    messagingSenderId: "281988363689",
    appId: "1:281988363689:web:52e8ce9daf4ece992a80b8"
};

// Initialize Firebase (using compat SDK)
firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
const database = firebase.database();

// Export for use in other files
window.db = database;
