import axios from "axios";
import {doc, updateDoc} from "firebase/firestore";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

async function generateWeaponAndImage(player1Items, player2Items) {
  //make prompt
  const prompt = `
    Create an image of a weapon combining: ${player1Items.join(', ')}.
    As well as another weapon combining the following items: ${player2Items.join(', ')}.
    Given that player 1 has the first weapon and player 2 has the second weapon.
    There has to be a winner. Who would win?
  `;

  try {
    // Send request to OpenAI
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024"
    });

    // Extract relevant data
    const imageUrl = response.data[0].url; // Get the image URL
    const description = response.data[0].revised_prompt; // Get the revised text prompt

    return {
      imageUrl: imageUrl,
      description: description
    };
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
}