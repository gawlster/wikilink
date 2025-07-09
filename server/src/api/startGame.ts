import { VercelRequest, VercelResponse } from "@vercel/node";
import { createGame } from "../game";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        const game = await createGame();
        res.status(200).json(game);
    } catch (error) {
        console.error("Error starting game:", error);
        res.status(500).json({ error: "Failed to start game" });
    }
}
