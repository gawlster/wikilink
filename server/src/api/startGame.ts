import { type Request, type Response } from "express";
import { createGame } from "../game";

export default async function handler(req: Request, res: Response) {
    try {
        const game = await createGame();
        res.status(200).json(game);
    } catch (error) {
        console.error("Error starting game:", error);
        res.status(500).json({ error: "Failed to start game" });
    }
}
