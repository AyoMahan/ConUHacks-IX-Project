import { db } from "./firebase";
import { doc, setDoc, updateDoc, onSnapshot, getDoc } from "firebase/firestore";
import { writable } from "svelte/store";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { gameState } from "./stores";

export async function createGame(challenge) {
    const gameId = uuidv4();
    const gameRef = doc(db, "games", gameId);
    await setDoc(gameRef, { challenge, players: {}, winner: null });

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

async function joinGame(gameId, playerName, playerAvatar) {
    const gameRef = doc(db, "games", gameId);
    const gameSnap = await getDoc(gameRef);

    if (gameSnap.exists()) {
        console.log("Joined game:", gameId);
        await updateDoc(gameRef, {
            [`players.${playerId}`]: { name: playerName, avatar: playerAvatar }
        });
        return true;
    } else {
        console.error("Game does not exist!");
        return false;
    }
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