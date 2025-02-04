<script>
  import Timer from "$lib/components/Timer.svelte";
  import { submitWeapons, resetGameFlag } from "../../game";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { lobbyId, name } from "$lib/stores";
  import { goto } from "$app/navigation";

  let playerId = get(name);
  let box1 = "";
  let box2 = "";
  let box3 = "";
  let submitted = false;

  onMount(() => {
    resetGameFlag(get(lobbyId));
  });

  function handleClick() {
    const selectedWeapons = [box1, box2, box3];
    submitWeapons(get(lobbyId), playerId, selectedWeapons);
    submitted = true;
  }
</script>

<div class="container">
  <Timer />
  {#if !submitted}
    <h1 class="title">Pick Your Weapons</h1>
  {:else}
    <h1 class="title">Waiting for opponent...</h1>
  {/if}
  <div class="top-boxes">
    <input class="box" bind:value={box1} disabled={submitted} placeholder="Enter Weapon 1" />
    <input class="box" bind:value={box2} disabled={submitted} placeholder="Enter Weapon 2" />
    <input class="box" bind:value={box3} disabled={submitted} placeholder="Enter Weapon 3" />
  </div>
  {#if !submitted}
    <button class="bottom-box" on:click={handleClick}>Submit</button>
  {/if}
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin-top: 20px;
  }

  /* ✅ Title with Papyrus font in black */
  .title {
    font-family: Papyrus, fantasy;
    font-size: 4.5rem;
    font-weight: bold;
    color: black;
  }

  .top-boxes {
    display: flex;
    gap: 20px;
  }

  /* ✅ Black & White Box Styles */
  .box {
    width: 150px;
    height: 100px;
    background-color: white;
    color: black;
    text-align: center;
    font-size: 1rem;
    border-radius: 10px;
    border: 2px solid black;
    padding: 10px;
  }

  /* Input focus effect */
  .box:focus {
    outline: none;
    border: 2px solid black;
  }

  /* ✅ Submit Box (No Color, Only Borders) */
  .bottom-box {
    width: 150px;
    height: 100px;
    background-color: white;
    color: black;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.2rem;
    font-weight: bold;
    border-radius: 10px;
    border: 2px solid black;
    cursor: pointer;
    transition: 0.2s;
  }

  /* Hover effect for submit button */
  .bottom-box:hover {
    background-color: black;
    color: white;
  }

  /* Responsive for smaller screens */
  @media (max-width: 500px) {
    .top-boxes {
      flex-direction: column;
      align-items: center;
    }
  }
</style>
