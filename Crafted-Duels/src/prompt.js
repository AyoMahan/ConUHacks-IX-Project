import axios from "axios";
import {doc, updateDoc} from "firebase/firestore";
const API_KEY = process.env.GEMINI_API_KEY;

export async function determineWinner(player1Items, player2Items) {
    const prompt = `
    Player 1 has the following items ${player1Items.join(', ')}  
    Player 2 has the following items ${player2Items.join(', ')}
    Make a weapon combining the following items and Generate an image of the combined weapon.
    Based on the challenge, player would win in a duel based their weapon. Describe the scene that would play out if they were to duel.
    Declare the winner, player 1 or player 2.
    `;

    const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText?key=${API_KEY}`,
        {
            contents: [{ parts: [{ text: prompt }] }],
        }
    );

    const aiDecision = response.data.candidates[0].content.parts[0].text;
/*
    // Get the winner 
   

    // Update Firestore with the winner
  
*/
}