// ✅ Load Firebase Configuration from env.js
const firebaseConfig = FIREBASE_CONFIG;


// ✅ Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
