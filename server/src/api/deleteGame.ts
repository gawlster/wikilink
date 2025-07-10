import { type Request, type Response } from "express";
import { deleteGame } from "../game";

export default async function handler(req: Request, res: Response) {
    const { gameId } = req.body;
    try {
        if (!gameId) {
            res.status(400).json({ error: "Missing game ID" });
            return;
        }

        await deleteGame(gameId);
        res.status(200).json({ message: "Game deleted successfully" });
    } catch (error) {
        console.error("Error deleting game:", error);
        res.status(500).json({ error: "Failed to delete game" });
    }
}
