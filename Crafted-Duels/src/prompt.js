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
    and there has to be a winner, who would win?
  `;

  try {
    // Send the prompt 
    const response = await openai.images.generate({
      prompt: prompt,
    });

    const imageUrl = response.data[0].url; // Image URL
    const description = response.text;   // Text description (duel and winner)

    return {
      imageUrl: imageUrl,
      description: description
    };
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
}