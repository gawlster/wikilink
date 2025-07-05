"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const game_1 = require("./game");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.send('Hello from Express with TypeScript!');
});
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
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
