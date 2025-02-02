<script>
  import Timer from "$lib/components/Timer.svelte";
  import { submitWeapon } from "../../../game";
  import { page } from "$app/stores";
  import { onMount } from "svelte";

  export let data;
  const gameId = data.gameId;
  let playerId = "";
  let box1 = "";
  let box2 = "";
  let box3 = "";

  onMount(() => {
    const urlParams = new URLSearchParams($page.url.search);
    playerId = urlParams.get("playerId");
    console.log(playerId);
  });

  function handleClick() {
    console.log(gameId);
    console.log("Weapons Selected:", box1, box2, box3);
    const selectedWeapons = [box1, box2, box3];
    alert(`Weapons Selected: ${box1}, ${box2}, ${box3}`);
    selectedWeapons.forEach((weapon) => {
      // firestore.collection('selectedWeapons').add({ weapon: weapon });
      submitWeapon(gameId, playerId, weaponsId);
      console.log("Submitting weapon:", weapon);
      goto("/result");
    });
    return selectedWeapons;
  }
</script>

<div class="container">
  <Timer />
  <h1 class="title">Pick Your Weapons</h1>
  <div class="top-boxes">
    <input class="box" bind:value={box1} placeholder="Enter Weapon 1" />
    <input class="box" bind:value={box2} placeholder="Enter Weapon 2" />
    <input class="box" bind:value={box3} placeholder="Enter Weapon 3" />
  </div>
  <button class="bottom-box" on:click={handleClick}>Submit</button>
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
