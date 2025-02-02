<script>
  import { goto } from "$app/navigation";
  import Rules from "$lib/components/Rules.svelte";
  import {
    createGame,
    joinGame,
    listenToGame,
    gameState,
    submitWeapon,
  } from "../game";
  let challenge = "Survive an alien invasion";
  let weapon = "";
  let playerId = "player-" + Math.floor(Math.random() * 1000); // Random player ID
  let gameId = "";
  let joiningGameId = "";
  let inGame = false;

  function navigateTo(path) {
    goto(path);
  }

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

<div class="main-menu-outer-container">
  <div class="main-menu-inner-container">
    <div class="top-menu">
      <h1 class="title">Crafted Duels</h1>
      <img class="logo-img" src="/images/logo.jpg" alt="Logo" />
    </div>
    <div class="bottom-menu">
      <div
        class="create-btn"
        role="button"
        tabindex="0"
        on:click={() => navigateTo("/create")}
        on:keydown={(e) =>
          (e.key === "Enter" || e.key === " ") && navigateTo("/create")}
      >
        Create
      </div>
      <div
        class="join-btn"
        role="button"
        tabindex="0"
        on:click={() => navigateTo("/join")}
        on:keydown={(e) =>
          (e.key === "Enter" || e.key === " ") && navigateTo("/join")}
      >
        Join
      </div>
    </div>
    <div class="footer">
      <Rules />
    </div>
  </div>
</div>

<style>
  .main-menu-outer-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    justify-content: center;
    min-height: 90vh;
    width: 100%;
  }

  .main-menu-inner-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 80%;
    gap: 50px;
  }

  .top-menu {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .title {
    text-wrap: nowrap;
    font-size: 72px;
  }

  .bottom-menu {
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    gap: 40px;
    margin-bottom: 1em;
  }

  .footer {
    position: absolute;
    bottom: 0;
    align-self: flex-start;
  }

  .create-btn,
  .join-btn {
    font-size: 34px;
    outline: 2px black solid;
    border-radius: 20px;
    height: 2em;
    width: 10em;
    padding: 15px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
  }

  .create-btn:hover, .join-btn:hover{
    background-color: lightcoral;
    cursor: pointer;
  }

  .logo-img {
    object-fit: scale-down;
    max-width: 150px;
  }
</style>
