<script>
	import { lobbyId, name } from "$lib/stores";
	import { goto } from "$app/navigation";
	import { joinGame, listenToGame } from "../../game";
	import { onMount } from "svelte";

	let playerName = "";
	let roomCode = "";

	async function joinRoom() {
		if (!playerName || !roomCode) {
			alert("Please enter both username and room code.");
			return;
		}
		roomCode = roomCode.toUpperCase();
		lobbyId.set(roomCode);
		name.set(playerName);
		await joinGame(roomCode, playerName);
		goto("/lobby");
	}
</script>

<div class="lobby-container fade-in">
	<h1 class="glow">🔗 Join a Game</h1>

	<div class="input-container">
		<p>Your Username:</p>
		<input
			type="text"
			bind:value={playerName}
			placeholder="Enter your name"
			class="glow-input"
		/>
	</div>

	<div class="input-container">
		<p>Room Code:</p>
		<input
			type="text"
			bind:value={roomCode}
			placeholder="Enter Room Code"
			class="glow-input uppercase"
		/>
	</div>

	<button on:click={joinRoom} class="button neon-button">🚀 Join Room</button>
</div>

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

	.lobby-container {
		width: 30%;
		max-height: 70vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding-bottom: 2em;
		padding-left: 2em;
		padding-right: 2em;
		max-width: 500px;
		margin: auto;
		height: auto;
		background: rgba(0, 0, 0, 0.6);
		border-radius: 12px;
		box-shadow: 0 0 20px rgba(255, 222, 173, 0.4);
		overflow-y: scroll;
		scrollbar-width: none;
		-ms-overflow-style: none; 
	}

	.lobby-container::-webkit-scrollbar {
		display: none;
	}

	.glow {
		color: #ffdead;
		text-shadow: 0px 0px 8px #ffdead;
	}

	.input-container {
		width: 100%;
		text-align: left;
		margin-bottom: 1rem;
	}

	label {
		display: block;
		font-size: 1.2rem;
		color: white;
		margin-bottom: 0.5rem;
	}

	.glow-input {
		width: calc(100% - 20px);
		padding: 0.75rem;
		font-size: 1.2rem;
		border: 2px solid #ffdead;
		background: rgba(214, 122, 9, 0.8);
		color: #ffdead;
		border-radius: 8px;
		outline: none;
		text-align: center;
		box-shadow: 0 0 10px rgba(255, 222, 173, 0.5);
	}

	.glow-input::placeholder{
        color: darkgrey;
    }

	.button {
		margin-top: 1em;
		padding: 1rem 2rem;
		font-size: 1.2rem;
		background: linear-gradient(90deg, #d67a09, #8a4f07);
		border: 4px #ffdead solid;
		border-radius: 8px;
		cursor: pointer;
		color: white;
		text-wrap: nowrap;
		font-weight: bold;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.button:hover {
		transform: scale(1.05);
		box-shadow: 0px 0px 15px #ffdead;
	}

	.neon-button {
		box-shadow: 0 0 15px rgba(255, 222, 173, 0.8);
	}

	.uppercase {
		text-transform: uppercase;
	}

	.uppercase::placeholder {
		text-transform: none;
	}
</style>
