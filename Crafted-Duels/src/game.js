import { db } from "./firebase";
import { doc, setDoc, updateDoc, onSnapshot, getDoc, arrayUnion, runTransaction } from "firebase/firestore";
import { writable, get } from "svelte/store";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { goto } from "$app/navigation";

export const gameState = writable(null);
export const lobbyPlayers = writable([]); // Store for real-time players
export const imageUrl = writable("");
export const description = writable("");

export async function createGame() {
    const gameId = Math.random().toString(36).substr(2, 4).toUpperCase();
    const gameRef = doc(db, "games", gameId);
    await setDoc(gameRef, {
        gotoGameFlag: false,
        gotoResultFlag: false,
        generatingResults: false,
        winner: null,
        players: [
            {
                name: "Player 1",
                avatar: "🧑‍🚀",
                weapons: [],
            },
        ],
        imageUrl: "",
        description: "",
    });

    return gameId;
}

// ✅ Listen for real-time updates like players joining or game starting
export function listenToGame(gameId) {
    const gameRef = doc(db, "games", gameId);
    return onSnapshot(gameRef, async (docSnap) => {
        if (docSnap.exists()) {
            const gameData = docSnap.data();
            lobbyPlayers.set(gameData.players || []);
            gameState.set(gameData);

            // Check if the game has started
            if (gameData.gotoGameFlag) {
                console.log("Game started, redirecting players to /play...");
                goto(`/play`);
            }

            if (gameData.gotoResultFlag) {
                console.log("Game finished, redirecting players to /result...");
                goto(`/result`);
            }

            if (gameData.imageUrl && !get(imageUrl)) {
                imageUrl.set(gameData.imageUrl);
                description.set(gameData.description);
            }
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

export async function submitWeapons(gameId, playerName, newWeapons) {
    console.log(`Submitting weapons: ${newWeapons} for player: ${playerName}`);
    const gameRef = doc(db, "games", gameId);
    const gameSnap = await getDoc(gameRef);

    if (gameSnap.exists()) {
        let players = gameSnap.data().players || [];
        const playerIndex = players.findIndex((p) => p.name === playerName);
        if (playerIndex == -1) {
            return;
        }

        players[playerIndex].weapons = newWeapons;
        await updateDoc(gameRef, { players });
        console.log("Weapon submitted successfully!");

        if (players[1 - playerIndex].weapons.length > 0) {
            await updateDoc(gameRef, {
                gotoResultFlag: true,
            });
        }
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

export async function getPlayerNames(gameId) {
    const gameRef = doc(db, "games", gameId);
    const gameSnap = await getDoc(gameRef);

    if (gameSnap.exists()) {
        let players = gameSnap.data().players || [];
        return players.map(player => player.name);
    } else {
        console.error("Game does not exist!");
        return [];
    }
}

export async function resetGameFlag(gameId) {
    const gameRef = doc(db, "games", gameId);
    await updateDoc(gameRef, {
        gotoGameFlag: false,
    });
    console.log("Game has started!");
}

export async function resetResultFlag(gameId) {
    const gameRef = doc(db, "games", gameId);
    await updateDoc(gameRef, {
        gotoResultFlag: false,
    });
}

export async function startGame(gameId) {
    const gameRef = doc(db, "games", gameId);

    await updateDoc(gameRef, {
        gotoGameFlag: true,
    });
}

export async function getWeapons1(gameId) {
    const gameRef = doc(db, "games", gameId);
    const gameSnap = await getDoc(gameRef);

    if (gameSnap.exists()) {
        // Get weapons from the first player
        const players = gameSnap.data().players;
        if (players && players[0]) {
            return players[0].weapons || [];
        } else {
            console.error("Player data is not available.");
            return [];
        }
    } else {
        console.error("Game does not exist!");
        return [];
    }
}

export async function getWeapons2(gameId) {
    const gameRef = doc(db, "games", gameId);
    const gameSnap = await getDoc(gameRef);

    if (gameSnap.exists()) {
        // Get weapons from the first player
        const players = gameSnap.data().players;
        if (players && players[1]) {
            return players[1].weapons || []; // Access the 'weapons' property directly
        } else {
            console.error("Player data is not available.");
            return [];
        }
    } else {
        console.error("Game does not exist!");
        return [];
    }
}

export async function generateWeapons(gameId) {
    const gameRef = doc(db, "games", gameId);

    try {
        // Run a Firestore transaction so only one player sends open ai request
        const gameData = await runTransaction(db, async (transaction) => {
            const gameSnap = await transaction.get(gameRef);

            if (!gameSnap.exists()) {
                console.error("Game does not exist!");
                return;
            }

            const gameData = gameSnap.data();

            if (gameData.generatingResults) {
                console.log("Not sending OpenAI request - another client is already processing.");
                return null;
            }

            transaction.update(gameRef, { generatingResults: true });
            return gameData;
        });

        if (!gameData) return;

        const player1Items = gameData.players[0]?.weapons || [];
        const player2Items = gameData.players[1]?.weapons || [];
        const name1 = gameData.players[0]?.name || "Player 1";
        const name2 = gameData.players[1]?.name || "Player 2";

        console.log("Sending OpenAI request...");
        const response = await fetch("/api/generate-weapon", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ player1Items, player2Items, name1, name2 }),
        });

        const result = await response.json();

        if (result.imageUrl) {
            await updateDoc(gameRef, {
                imageUrl: result.imageUrl,
                description: result.description,
                generatingResults: false,
            });
        }
    } catch (error) {
        console.error("Error in transaction:", error);
        await updateDoc(gameRef, { generatingResults: false }); // Reset flag on error
    }
}