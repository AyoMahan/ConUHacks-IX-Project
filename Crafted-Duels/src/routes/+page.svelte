<script>
  import { goto } from "$app/navigation";
  import { lobbyId } from "$lib/stores";
  import Rules from "$lib/components/Rules.svelte";
  import PopupMessage from "$lib/components/PopupMessage.svelte";
  let showHelpPopup = false;

  function openHelpPopup() {
    showHelpPopup = true;
  }

  function closeHelpPopup() {
    showHelpPopup = false;
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
        on:click={() => goto(`/lobby`)}
        on:keydown={(e) =>
          (e.key === "Enter" || e.key === " ") && goto("/lobby")}
      >
        Create
      </div>
      <div
        class="join-btn"
        role="button"
        tabindex="0"
        on:click={() => goto("/join")}
        on:keydown={(e) =>
          (e.key === "Enter" || e.key === " ") && goto("/join")}
      >
        Join
      </div>
    </div>
    <div class="footer">
      <Rules on:click={openHelpPopup} />
    </div>
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
  .main-menu-outer-container {
    position: relative;
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
