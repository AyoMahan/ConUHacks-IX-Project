<script>
  import {
    createGame,
    submitWeapon,
    determineWinner,
    listenToGame,
    gameState,
  } from "./game.js";
  let gameId = "test-game";
  let challenge = "Survive an alien invasion";
  let weapon = "";
  let playerId = "player1";

  createGame(gameId, challenge);
  listenToGame(gameId);

  async function submit() {
    await submitWeapon(gameId, playerId, weapon);
  }

  async function pickWinner() {
    $gameState &&
      determineWinner(gameId, $gameState.challenge, $gameState.weapons);
  }
</script>

<h1>Multiplayer AI Game</h1>

{#if $gameState}
  <p><strong>Challenge:</strong> {$gameState.challenge}</p>
  <p><strong>Weapons:</strong> {JSON.stringify($gameState.weapons)}</p>
  {#if $gameState.winner}
    <p><strong>Winner:</strong> {$gameState.winner} 🎉</p>
  {/if}
{/if}

<input bind:value={weapon} placeholder="Enter your weapon" />
<button on:click={submit}>Submit Weapon</button>
<button on:click={pickWinner}>Pick Winner (AI)</button>
