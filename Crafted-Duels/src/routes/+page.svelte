<script>
  import { goto } from "$app/navigation";
  import { lobbyId } from "./lib/stores";
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
    lobbyId.set(gameId);
    listenToGame(gameId);
    navigateTo(`/lobby`);
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

<div class="main-menu-outer-container fade-in">
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
        on:click={createNewGame}
        on:keydown={(e) =>
          (e.key === "Enter" || e.key === " ") && navigateTo("/lobby")}
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
    color: antiquewhite;
    text-shadow: 0 0 10px rgba(255, 222, 173, 0.8);
    animation: glowText 1.5s infinite alternate;
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

  @keyframes glowText {
    from {
      text-shadow: 0 0 10px #ffcc29;
    }
    to {
      text-shadow: 0 0 20px #ffcc29;
    }
  }
  .create-btn,
  .join-btn {
    font-size: 34px;
    outline: 4px #ffdead solid;
    border-radius: 10px;
    height: 2em;
    width: 10em;
    padding: 15px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
    background-color: rgba(214, 122, 9, 0.8);
    color: #ffdead;
    transition: all 0.3s ease-in-out;
    box-shadow: 0 0 10px rgba(255, 222, 173, 0.6);
  }

  .create-btn:hover,
  .join-btn:hover {
    background-color: #8a4f07;
    cursor: pointer;
    box-shadow: 0 0 15px rgba(255, 255, 255, 1);
    transform: translateY(-3px);
  }

  .logo-img {
    object-fit: scale-down;
    max-width: 150px;
  }
</style>
