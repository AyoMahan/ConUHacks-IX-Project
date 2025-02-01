@ -2,25 +2,42 @@
import { doc, setDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { writable } from "svelte/store";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export const gameState = writable(null);

export async function createGame(gameId, challenge) {
export async function createGame(challenge) {
    const gameId = uuidv4();
    const gameRef = doc(db, "games", gameId);
    await setDoc(gameRef, { challenge, weapons: {}, winner: null });

    return gameId;
}

export function listenToGame(gameId) {
    const gameRef = doc(db, "games", gameId);
    return onSnapshot(gameRef, (docSnap) => {
        if (docSnap.exists()) {
            gameState.set(docSnap.data());
        }
    });
}

export async function joinGame(gameId) {
    const gameRef = doc(db, "games", gameId);
    const gameSnap = await getDoc(gameRef);

    if (gameSnap.exists()) {
        console.log("Joined game:", gameId);
        return true;
    } else {
        console.error("Game does not exist!");
        return false;
    }
}

export async function submitWeapon(gameId, playerId, weapon) {
    console.log("Submitting weapon:", weapon, "for player:", playerId);
    const gameRef = doc(db, "games", gameId);
