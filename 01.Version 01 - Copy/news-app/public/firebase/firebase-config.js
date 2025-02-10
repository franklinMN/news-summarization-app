// ✅ Firebase Configuration
const firebaseConfig = {
    apiKey: process.env.FUNCTIONS_CONFIG.firebase.apiKey,
    authDomain: "news-app-fmn13.firebaseapp.com",
    projectId: "news-app-fmn13",
    storageBucket: "news-app-fmn13.appspot.com",
    messagingSenderId: "710008863344",
    appId: "1:710008863344:web:98f525b9167eb8679052b5"
};

// ✅ Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
