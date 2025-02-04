import { json } from "@sveltejs/kit";
import { OPENAI_API_KEY } from "$env/static/private";

export async function POST({ request }) {
    const { player1Items, player2Items, name1, name2 } = await request.json();
    console.log(name1, name2);

    const prompt = `
        The first player, called ${name1}, has the following items: ${player1Items.join(", ")}.
        The second player, called ${name2}, has the following items: ${player2Items.join(", ")}.
        Combine their items into a powerful creative weapon.
        Generate an image of the combattants, each wielding their weapon, and describe the scene of a duel between ${name1} and ${name2} based on their weapons.
        Declare a clear winner based on the weapons created.
    `;

    try {
        console.log("Sending OpenAI request!");
        const openaiResponse = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "dall-e-3",
                prompt,
                n: 1,
                size: "1024x1024",
            }),
        });
        const result = await openaiResponse.json();

        return json({
            imageUrl: result?.data?.[0]?.url || null,
            description: result?.data?.[0]?.revised_prompt || "No description available.",
        });
    } catch (error) {
        console.error("Error generating image:", error);
        return json({ error: "Failed to generate image" }, { status: 500 });
    }
}
