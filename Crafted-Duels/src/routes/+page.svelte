<script>
  import {
    createGame,
    joinGame,
    listenToGame,
    gameState,
    submitWeapon,
  } from "../game";
  import PickWeaponsPage from "./PickWeapons/+page.svelte";
  let challenge = "Survive an alien invasion";
  let weapon = "";
  let playerId = "player-" + Math.floor(Math.random() * 1000); // Random player ID
  let gameId = "";
  let joiningGameId = "";
  let inGame = false;

  async function createNewGame() {
    gameId = await createGame(challenge);
    inGame = true;
    listenToGame(gameId);
  }

  async function joinExistingGame() {
    const success = await joinGame(joiningGameId);
    if (success) {
      gameId = joiningGameId;
      inGame = true;
      listenToGame(gameId);
    }
  }

  async function submit() {
    await submitWeapon(gameId, playerId, weapon);
  }

</script>

<h1>Multiplayer AI Game</h1>

{#if !inGame}
  <h2>Create a new game</h2>
  <button on:click={createNewGame}>Start New Game</button>

  <h2>Or Join a Game</h2>
  <input bind:value={joiningGameId} placeholder="Enter Room Code" />
  <button on:click={joinExistingGame}>Join Game</button>
{/if}

{#if inGame}
  <p><strong>Game ID:</strong> {gameId}</p>
  <p>Share this code with your friends so they can join!</p>

  {#if $gameState}
    <p><strong>Challenge:</strong> {$gameState.challenge}</p>
    <p><strong>Weapons:</strong> {JSON.stringify($gameState.weapons)}</p>
    {#if $gameState.winner}
      <p><strong>Winner:</strong> {$gameState.winner} 🎉</p>
    {/if}
  {/if}

  <input bind:value={weapon} placeholder="Enter your weapon" />
  <button on:click={submit}>Submit Weapon</button>
{/if}
