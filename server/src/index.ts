import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import { createGame, deleteGame, getGameFromId, saveGame } from './game';
import { areArticlesTheSame, getOutgoingArticleUrls } from './wikipediaUtils';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/startGame", async (req: Request, res: Response) => {
    try {
        const game = await createGame();
        res.status(200).json(game);
    } catch (error) {
        console.error("Error starting game:", error);
        res.status(500).json({ error: "Failed to start game" });
    }
});

app.post("/navigateLink", async (req: Request, res: Response) => {
    const { gameId, oldPageUrl, newPageUrl } = req.body;
    try {
        if (!gameId || !oldPageUrl || !newPageUrl) {
            res.status(400).json({ error: "Missing required parameters" });
            return;
        }

        const game = await getGameFromId(gameId);
        if (!areArticlesTheSame(game.currentArticleUrl, oldPageUrl)) {
            res.status(400).json({ error: "Invalid game ID or current article URL" });
            return;
        }

        const legalLinks = await getOutgoingArticleUrls(oldPageUrl);
        if (!legalLinks.find((link) => areArticlesTheSame(link, newPageUrl))) {
            res.status(400).json({ error: "Illegal navigation" });
            return;
        }

        game.currentArticleUrl = newPageUrl;
        game.stepsTaken += 1;

        if (areArticlesTheSame(newPageUrl, game.endingArticleUrl)) {
            game.hasWon = true;
        }

        await saveGame(game);

        res.status(200).json({ game });
    } catch (error) {
        console.error("Error navigating link:", error);
        res.status(500).json({ error: "Failed to navigate link" });
    }
})

app.delete("/deleteGame", async (req: Request, res: Response) => {
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
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
