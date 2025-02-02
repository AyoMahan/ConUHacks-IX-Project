<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { get } from "svelte/store";
  import { lobbyId, weapons } from "$lib/stores";
  import { getWeapons1, getWeapons2 } from '../../game';

  // Writable stores to hold the image URL and description
  let imageUrl = writable('');
  let description = writable('');

  // Function to fetch the image and description from OpenAI API
  async function generateWeaponAndImage() {
    console.log('hi');
    let player1Items = getWeapons1(get(lobbyId));
    console.log(player1Items);
    let player2Items = getWeapons2(get(lobbyId));
    console.log(player2Items);
    const prompt = `
      Player 1 has the following items: ${player1Items.join(', ')}.
      Player 2 has the following items: ${player2Items.join(', ')}.
      Combine these items into a single powerful weapon.
      Generate an image of the combined weapon and describe the scene of a duel between Player 1 and Player 2 based on their weapons.
      Declare the winner, based on the weapons created.
    `;

    try {
      // Make the request to your backend (or API route) for OpenAI
      const response = await fetch('/generate-weapon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: prompt,
          n: 1,
          size: "1024x1024",
        }),
      });

      const result = await response.json();

      // Assuming the result from your backend contains these fields
      if (result && result.data && result.data[0]) {
        const apiImageUrl = result.data[0].url;         // Image URL
        const apiDescription = result.data[0].revised_prompt;  // Image description
        console.log('Image URL:', apiImageUrl);

        // Update your image and description stores
        imageUrl.set(apiImageUrl);  
        description.set(apiDescription);
      }
    } catch (error) {
      console.error('Error generating image:', error);
    }
  }

  onMount(() => {
    generateWeaponAndImage();  // Automatically fetch when the component is mounted
  });
</script>

  
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
  
  <div class="container">
    <h1>Weapon Duel</h1>
    <h1>A VICTOR HAS EMERGED</h1>
    
    <div class="image-frame">
      {#if $imageUrl}
        <img src={$imageUrl} alt="Weapon Duel Image" />
      {:else}
        <p>Loading image...</p>
      {/if}
    </div>
    
    <div class="image-frame">
        <img src="/images/example-result.png" alt="example">
    </div>    
    <div class="text-frame">
        
      {#if $description}
        <p>{$description}</p>
      {/if}
      
</div>
  </div>
  
  
  
  