// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Your web app's Firebase configuration from your project settings
const firebaseConfig = {
  apiKey: "AIzaSyDS4KSp6qzVpVr-roaPoDfWFTZMtrc3ZAM",
  authDomain: "wordblasters-game.firebaseapp.com",
  projectId: "wordblasters-game",
  storageBucket: "wordblasters-game.firebasestorage.app",
  messagingSenderId: "1351916822",
  appId: "1:1351916822:web:2ae1f02fa9b5451e314437",
  measurementId: "G-S7WSX7H47T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Helper function to save a score to a specific minigame leaderboard
export async function submitScore(gameName, playerName, score) {
    try {
        await addDoc(collection(db, "leaderboards", gameName, "scores"), {
            name: playerName,
            score: score,
            timestamp: new Date()
        });
        console.log("Score saved successfully!");
    } catch (e) {
        console.error("Error adding score: ", e);
    }
}

// Helper function to fetch top scores for the leaderboard modal
export async function getLeaderboard(gameName) {
    try {
        const q = query(collection(db, "leaderboards", gameName, "scores"), orderBy("score", "desc"), limit(10));
        const querySnapshot = await getDocs(q);
        let scores = [];
        querySnapshot.forEach((doc) => {
            scores.push(doc.data());
        });
        return scores;
    } catch (e) {
        console.error("Error fetching leaderboard: ", e);
        return [];
    }
}
