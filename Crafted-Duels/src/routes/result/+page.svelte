<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { get } from "svelte/store";
  import { lobbyId } from "$lib/stores";
  import {
    imageUrl,
    description,
    resetResultFlag,
    generateWeapons,
  } from "../../game";

  onMount(async () => {
    resetResultFlag(get(lobbyId));
    await generateWeapons(get(lobbyId));
  });
</script>

<div class="container">
  <h1>Weapon Duel</h1>
  <h1>A VICTOR HAS EMERGED</h1>

  <div class="image-frame">
    {#if $imageUrl}
      <img src={$imageUrl} alt="Weapon Duel" />
    {:else}
      <p>Loading image...</p>
    {/if}
  </div>

  <div class="text-frame">
    {#if $description}
      <p>{$description}</p>
    {/if}
  </div>
</div>

<style>
  .container {
    text-align: center;
  }

  /* Rectangular frame for the image */
  .image-frame {
    border: 5px solid #444;
    padding: 10px;
    margin: 20px auto;
    width: 600px; /* Adjust as needed */
    height: 350px; /* Fixed height for a rectangle */
    background: #ddd;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    overflow: hidden;
  }

  /* Ensures the image fits inside without stretching */
  .image-frame img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain; /* Keeps aspect ratio */
  }

  /* Frame for the text */
  .text-frame {
    border: 3px solid #666;
    padding: 15px;
    margin: 20px auto;
    width: 600px; /* Match image width */
    background: #f8f8f8;
    box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    font-size: 1.2rem;
    line-height: 1.6;
    color: #333;
  }

  h1 {
    text-align: center;
    color: #222;
  }
</style>
