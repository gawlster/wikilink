"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const game_1 = require("./game");
const wikipediaUtils_1 = require("./wikipediaUtils");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.get("/startGame", async (req, res) => {
    try {
        const game = await (0, game_1.createGame)();
        res.status(200).json(game);
    }
    catch (error) {
        console.error("Error starting game:", error);
        res.status(500).json({ error: "Failed to start game" });
    }
});
app.post("/navigateLink", async (req, res) => {
    const { gameId, oldPageUrl, newPageUrl } = req.body;
    try {
        if (!gameId || !oldPageUrl || !newPageUrl) {
            res.status(400).json({ error: "Missing required parameters" });
            return;
        }
        const game = await (0, game_1.getGameFromId)(gameId);
        if (!(0, wikipediaUtils_1.areArticlesTheSame)(game.currentArticleUrl, oldPageUrl)) {
            res.status(400).json({ error: "Invalid game ID or current article URL" });
            return;
        }
        const legalLinks = await (0, wikipediaUtils_1.getOutgoingArticleUrls)(oldPageUrl);
        if (!legalLinks.find((link) => (0, wikipediaUtils_1.areArticlesTheSame)(link, newPageUrl))) {
            res.status(400).json({ error: "Illegal navigation" });
            return;
        }
        game.currentArticleUrl = newPageUrl;
        game.stepsTaken += 1;
        if ((0, wikipediaUtils_1.areArticlesTheSame)(newPageUrl, game.endingArticleUrl)) {
            game.hasWon = true;
        }
        await (0, game_1.saveGame)(game);
        res.status(200).json({ game });
    }
    catch (error) {
        console.error("Error navigating link:", error);
        res.status(500).json({ error: "Failed to navigate link" });
    }
});
app.delete("/deleteGame", async (req, res) => {
    const { gameId } = req.body;
    try {
        if (!gameId) {
            res.status(400).json({ error: "Missing game ID" });
            return;
        }
        await (0, game_1.deleteGame)(gameId);
        res.status(200).json({ message: "Game deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting game:", error);
        res.status(500).json({ error: "Failed to delete game" });
    }
});
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
