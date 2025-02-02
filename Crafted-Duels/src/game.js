import { db } from "./firebase";
import { doc, setDoc, updateDoc, onSnapshot, getDoc, arrayUnion } from "firebase/firestore";
import { writable } from "svelte/store";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { goto } from "$app/navigation";

export const gameState = writable(null);
export const lobbyPlayers = writable([]); // Store for real-time players

export async function createGame() {
    const gameId = Math.random().toString(36).substr(2, 4).toUpperCase();
    const gameRef = doc(db, "games", gameId);
    await setDoc(gameRef, {
        isGameStarted: false,
        winner: null,
        players: [
            {
                name: "Player 1",
                avatar: "🧑‍🚀",
                weapons: [],
            },
        ],
    });

    return gameId;
}

export function listenToGame(gameId) {
    const gameRef = doc(db, "games", gameId);
    return onSnapshot(gameRef, (docSnap) => {
        if (docSnap.exists()) {
            const gameData = docSnap.data();
            gameState.set(gameData);

            // Check if the game has started
            if (gameData.gameStarted) {
                console.log("Game started, redirecting players to /play...");
                goto(`/play/${gameId}`);
            }
        }
    });
}

// ✅ Listen for players joining in real-time
export function listenToLobby(gameId) {
    const gameRef = doc(db, "games", gameId);
    return onSnapshot(gameRef, (docSnap) => {
        if (docSnap.exists()) {
            lobbyPlayers.set(docSnap.data().players || []);
        }
    });
}

export async function joinGame(gameId, playerName) {
    if (!playerName) {
        console.error("Player name is missing.");
        return false;
    }

    const gameRef = doc(db, "games", gameId);
    const gameSnap = await getDoc(gameRef);

    if (gameSnap.exists()) {
        await updateDoc(gameRef, {
            players: arrayUnion({ name: playerName, avatar: "🧑‍🚀", weapons: [] }),
        });

        console.log(`Player ${playerName} joined game ${gameId}`);
        return true;
    } else {
        console.error("Game does not exist!");
        return false;
    }
}

export async function submitWeapon(gameId, playerName, newWeapons) {
    console.log(`Submitting weapons: ${newWeapons} for player: ${playerName}`);
    const gameRef = doc(db, "games", gameId);
    const gameSnap = await getDoc(gameRef);

    if (gameSnap.exists()) {
        let players = gameSnap.data().players || [];
        const playerIndex = players.findIndex((p) => p.name === playerName);
        if (playerIndex !== -1) {
            if (!players[playerIndex].weapons) {
                players[playerIndex].weapons = [];
            }
            players[playerIndex].weapons = newWeapons;
        } else {
            players.push({ name: playerName, avatar: "👤", weapons: newWeapons });
        }
        await updateDoc(gameRef, { players });
        console.log("Weapon submitted successfully!");
    } else {
        console.error("Game does not exist!");
    }
}

export async function updatePlayerInfo(gameId, oldName, newName, newAvatar) {
    if (!oldName || !newName || !newAvatar) {
        console.error("All fields (oldName, newName, newAvatar) are required.");
        return false;
    }

    const gameRef = doc(db, "games", gameId);
    const gameSnap = await getDoc(gameRef);

    if (gameSnap.exists()) {
        let players = gameSnap.data().players || [];
        const playerIndex = players.findIndex((p) => p.name === oldName);
        if (playerIndex !== -1) {
            players[playerIndex].name = newName;
            players[playerIndex].avatar = newAvatar;
            await updateDoc(gameRef, { players });
            console.log(`Player updated: Name changed from ${oldName} to ${newName}, Avatar updated to ${newAvatar}`);
            return true;
        } else {
            console.error("Player not found.");
            return false;
        }
    } else {
        console.error("Game does not exist!");
        return false;
    }
}

export async function resetGameFlag(gameId) {
    const gameRef = doc(db, "games", gameId);

    await updateDoc(gameRef, {
        gameStarted: false,
    });

    console.log("Game has started!");
}

export async function startGame(gameId) {
    const gameRef = doc(db, "games", gameId);

    await updateDoc(gameRef, {
        gameStarted: true,
    });

    console.log("Game has started!");
}

export async function getWeapons1(gameId) {
    const gameRef = doc(db, "games", gameId);
    const gameSnap = await getDoc(gameRef);

    if (gameSnap.exists()) {
        return gameSnap.data().players[0].flat();
    } else {
        console.error("Game does not exist!");
        return [];
    }
}

export async function getWeapons2(gameId) {
    const gameRef = doc(db, "games", gameId);
    const gameSnap = await getDoc(gameRef);

    if (gameSnap.exists()) {
        return gameSnap.data().players[1].flat();
    } else {
        console.error("Game does not exist!");
        return [];
    }
}
