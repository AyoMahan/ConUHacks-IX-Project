<script>
	import { lobbyId } from "../lib/stores";
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
		lobbyId.set(roomCode);
		const opponent = await joinGame(roomCode, playerName);
		goto("/lobby");
	}
</script>

<div class="lobby-container fade-in">
	<h1 class="glow">🔗 Join a Game</h1>

	<div class="input-container">
		<label>Your Username:</label>
		<input
			type="text"
			bind:value={playerName}
			placeholder="Enter your name"
			class="glow-input"
		/>
	</div>

	<div class="input-container">
		<label>Room Code:</label>
		<input
			type="text"
			bind:value={roomCode}
			placeholder="Enter Room Code"
			class="glow-input"
		/>
	</div>

	<button on:click={joinRoom} class="button neon-button">Join Room 🚀</button>
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
		max-width: 450px;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 2rem;
		max-width: 500px;
		margin: auto;
		background: rgba(0, 0, 0, 0.6);
		border-radius: 12px;
		box-shadow: 0 0 20px rgba(255, 222, 173, 0.4);
		padding: 2rem;
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

	.button {
		padding: 1rem 2rem;
		font-size: 1.2rem;
		background: linear-gradient(90deg, #d67a09, #8a4f07);
		border: none;
		border-radius: 8px;
		cursor: pointer;
		color: white;
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
</style>
