import { db } from "./firebase";
import { doc, setDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { writable } from "svelte/store";
import axios from "axios";

const GEMINI_API_KEY = import.meta.env.GEMINI_API_KEY

export const gameState = writable(null);

export async function createGame(gameId, challenge) {
    const gameRef = doc(db, "games", gameId);
    await setDoc(gameRef, { challenge, weapons: {}, winner: null });
}

export function listenToGame(gameId) {
    const gameRef = doc(db, "games", gameId);
    return onSnapshot(gameRef, (docSnap) => {
        if (docSnap.exists()) {
            gameState.set(docSnap.data());
        }
    });
}

export async function submitWeapon(gameId, playerId, weapon) {
    console.log("Submitting weapon:", weapon, "for player:", playerId);
    const gameRef = doc(db, "games", gameId);

    try {
        await updateDoc(gameRef, { [`weapons.${playerId}`]: weapon });
        console.log("Weapon submitted successfully!");
    } catch (error) {
        console.error("Error submitting weapon:", error);
        // If the game does not exist, create it first
        await setDoc(gameRef, { weapons: { [playerId]: weapon } }, { merge: true });
    }
}

export async function determineWinner(gameId, challenge, weapons) {
    const prompt = `
      Challenge: ${challenge}
      Players submitted these weapons: ${JSON.stringify(weapons)}
      Based on the challenge, choose the best weapon and explain why.
    `;

    const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText?key=${GEMINI_API_KEY}`,
        {
            contents: [{ parts: [{ text: prompt }] }],
        }
    );
    console.log("post")

    const aiDecision = response.data.candidates[0].content.parts[0].text;

    // Extract the winner from the AI response
    let winner = "unknown";
    Object.keys(weapons).forEach(player => {
        if (aiDecision.includes(weapons[player])) {
            winner = player;
        }
    });

    // Update Firestore with the winner
    const gameRef = doc(db, "games", gameId);
    await updateDoc(gameRef, { winner });
}