<script>
    import { onMount, onDestroy } from "svelte";
    import { get } from "svelte/store";
    import Rules from "$lib/components/Rules.svelte";
    import PopupMessage from "$lib/components/PopupMessage.svelte";
    import Tooltip from "$lib/components/Tooltip.svelte";
    import { lobbyId, name } from "$lib/stores";
    import {
        createGame,
        listenToGame,
        lobbyPlayers,
        updatePlayerInfo,
        startGame,
        deleteGame,
    } from "../../game";
    import { goto } from "$app/navigation";
    import { browser } from "$app/environment";
    let showHelpPopup = false;
    let playerName = get(name) ?? "Player 1";
    let oldDbName = playerName;
    let oldName = playerName;
    let oldAvatar = "🧑‍🚀";
    let playerAvatar = "🧑‍🚀";
    let players = [];
    name.set(playerName);
    const avatars = [
        "🧑‍🚀",
        "🧑‍🎤",
        "🤖",
        "👽",
        "🐱",
        "🐶",
        "🐸",
        "🐵",
        "🦊",
        "🐯",
    ];
    let showCopiedBox = false;
    let copyTimeout;
    let showPlayersBox = false;
    let playerTimeout;

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text);
        showCopiedBox = true;
        clearTimeout(copyTimeout);
        copyTimeout = setTimeout(() => {
            showCopiedBox = false;
        }, 1000);
    }

    async function pushUpdateName() {
        if (!playerName) {
            alert("Please enter your current and new name.");
            return;
        }
        const success = await updatePlayerInfo(
            $lobbyId,
            oldDbName,
            playerName,
            playerAvatar,
        );

        if (success) {
            oldDbName = playerName;
        } else {
            alert(
                "Failed to update player info. Make sure you exist in the lobby.",
            );
        }
    }

    async function updateAvatar() {
        const success = await updatePlayerInfo(
            $lobbyId,
            playerName,
            playerName,
            playerAvatar,
        );
    }

    function updateName(newName) {
        let index = players.findIndex((p) => p.name == oldName);
        players[index].name = newName;
        oldName = newName;
        name.set(newName);
    }

    function openHelpPopup() {
        showHelpPopup = true;
    }

    function closeHelpPopup() {
        showHelpPopup = false;
    }

    async function goToMenu() {
        await deleteGame($lobbyId);
        lobbyId.set("");
        goto("/");
    }

    function start() {
        if (players.length <= 1) {
            showPlayersBox = true;
            clearTimeout(playerTimeout);
            playerTimeout = setTimeout(() => {
                showPlayersBox = false;
            }, 3000);
        } else {
            showPlayersBox = false;
            startGame($lobbyId);
        }
    }

    async function handleBeforeUnload(event) {
        if ($lobbyId) {
            await deleteGame($lobbyId);
        }
    }

    onMount(async () => {
        // Create game
        if (!get(lobbyId)) {
            let roomCode = await createGame();
            lobbyId.set(roomCode);
        }
        // Listen for real-time player updates
        listenToGame($lobbyId);
        lobbyPlayers.subscribe((data) => {
            players = data;
        });
        window.addEventListener("beforeunload", handleBeforeUnload);
        window.addEventListener("popstate", goToMenu);
    });

    onDestroy(() => {
        if (browser) {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener("popstate", goToMenu);
        }
    });
</script>

<div class="lobby">
    <h1 class="fade-in">🎮 Multiplayer Lobby</h1>

    <h2 class="fade-in">
        Your name: <input
            type="text"
            class="name-input"
            bind:value={playerName}
            on:input={() => updateName(playerName)}
            on:change={pushUpdateName}
            placeholder="Enter your name"
        />
    </h2>

    <h2 class="fade-in">
        Choose your avatar:
        <select
            bind:value={playerAvatar}
            on:change={updateAvatar}
            class="glow-hover"
        >
            {#each avatars as avatar}
                <option value={avatar}>{avatar}</option>
            {/each}
        </select>
    </h2>

    <h3 class="fade-in room-code-container">
        Room Code: <span class="room-code glow">{$lobbyId}</span>
        <Tooltip title="Copied!" isEnabled={showCopiedBox}>
            <button
                class="button copy-btn neon-button"
                on:click={() => copyToClipboard($lobbyId)}>📋 Copy</button
            >
        </Tooltip>
    </h3>

    <div class="vs-container fade-in">
        {#each players as player, index}
            <div class="player">
                <div class="icon">{player.avatar}</div>
                <p>{player.name}</p>
            </div>
            {#if index % 2 === 0 && index < players.length - 1}
                <h2 class="vs-text">⚔️ VS ⚔️</h2>
            {/if}
        {/each}
    </div>

    <div class="button-group fade-in">
        <div class="footer">
            <Rules on:click={openHelpPopup} />
        </div>
        <button class="button back-btn neon-button" on:click={goToMenu}
            >⬅️ Back</button
        >
        <Tooltip
            title="Two players are required to start!"
            isEnabled={showPlayersBox}
        >
            <button class="button start-btn neon-button" on:click={start}
                >🚀 Start</button
            >
        </Tooltip>
    </div>
</div>

{#if showHelpPopup}
    <PopupMessage
        message="⚔️ Welcome to the Ultimate Duel! ⚔️
You have 30 seconds to unleash your creativity!
Craft your weapon by writing 3 words—these will be your items of power.

Once both players are ready, you'll enter the arena where the AI Judge will decide your fate.
Think fast. Be bold. Conquer.

Good luck, warrior! 🗡️"
        on:close={closeHelpPopup}
    />
{/if}

<style>
    /* Smooth Fade-In Animation */
    .fade-in {
        animation: fadeIn 1s ease-in-out;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    h1,
    h2 {
        font-weight: bold;
    }

    .name-input::placeholder {
        color: darkgrey;
    }

    .lobby {
        width: 100%;
        max-width: 30em;
        max-height: 80vh;
        height: auto;
        background: rgba(58, 29, 3, 0.9);
        padding: 25px;
        border-radius: 15px;
        box-shadow: 0 0 20px rgba(255, 222, 173, 0.4);
        text-align: center;
        position: relative;
        margin: auto;
        text-wrap: nowrap;
        color: antiquewhite;
        flex-grow: 1;
        overflow-y: scroll;
        scrollbar-width: none;
        -ms-overflow-style: none;
    }

    .lobby::-webkit-scrollbar {
        display: none;
    }

    input,
    select {
        padding: 10px;
        font-size: 18px;
        margin: 10px 0;
        width: 80%;
        max-width: 350px;
        border-radius: 5px;
        border-radius: 5px;
        border: 2px solid #ffdead;
        background-color: rgba(214, 122, 9, 0.8);
        color: antiquewhite;
        text-align: center;
    }

    /* Glowing Effect on Avatar Selection */
    .glow-hover:hover {
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
        transition: 0.3s ease-in-out;
    }

    /* Button Styling */
    .button {
        font-size: 20px;
        border: 4px #ffdead solid;
        border-radius: 10px;
        height: 2.5em;
        width: 10em;
        padding: 10px;
        margin: 15px;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        user-select: none;
        background-color: rgba(214, 122, 9, 0.8);
        color: antiquewhite;
        transition: background-color 0.3s ease-in-out;
    }

    .button:hover {
        background-color: #8a4f07;
        cursor: pointer;
    }

    /* Button Click Effect */
    .button:active {
        transform: scale(0.95);
    }

    /* Neon Button Effect */
    .neon-button {
        transition: all 0.3s ease-in-out;
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.6);
    }

    .neon-button:hover {
        box-shadow: 0 0 15px rgba(255, 255, 255, 1);
        transform: translateY(-3px);
    }

    /* Different Button Colors */
    .copy-btn {
        background: #ff9f1a;
        color: antiquewhite;
    }
    .start-btn {
        background: #27ae60;
        color: antiquewhite;
    }
    .back-btn {
        background: #c0392b;
        color: antiquewhite;
    }

    /* VS Section */
    .vs-container {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .vs-text {
        font-size: 24px;
        color: #ffdead;
        font-weight: bold;
        animation: glowText 1.5s infinite alternate;
    }

    @keyframes glowText {
        from {
            text-shadow: 0 0 10px #ffcc29;
        }
        to {
            text-shadow: 0 0 20px #ffcc29;
        }
    }

    @media (max-width: 500px) {
        .lobby {
            width: 95%;
            padding: 15px;
        }
        input,
        select {
            width: 100%;
        }
        .button {
            width: 100%;
            font-size: 18px;
        }
    }
    /* Player Styles */
    .player {
        text-align: center;
        margin: 0 30px;
    }

    .player .icon {
        width: 70px;
        height: 70px;
        background: rgba(214, 122, 9, 0.8);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 40px;
        color: #ffdead;
        box-shadow: 0 0 10px rgba(255, 222, 173, 0.8);
        transition: transform 0.2s;
    }

    /* Hover Animation on Player Icons */
    .player .icon:hover {
        transform: scale(1.1);
    }

    /* Pulsing Effect for "Waiting for player..." */
    .pulse {
        animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        50% {
            transform: scale(1.1);
            opacity: 0.7;
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }

    /* Neon Glow on Room Code */
    .room-code {
        width: 20%;
        min-height: 5vh;
        font-size: 32x;
        font-weight: bold;
        background: rgba(214, 122, 9, 0.8);
        padding: 5px 15px;
        border-radius: 10px;
        display: inline-block;
        border: 2px solid #ffdead;
        color: antiquewhite;
        box-shadow: 0 0 10px rgba(255, 222, 173, 0.8);
        text-transform: uppercase;
        letter-spacing: 2px;
    }

    .room-code-container {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        margin: 15px 0;
    }
    .button-group {
        display: flex;
        justify-content: space-evenly;
    }
</style>
