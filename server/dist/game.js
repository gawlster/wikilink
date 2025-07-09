"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGame = createGame;
exports.getGameFromId = getGameFromId;
exports.saveGame = saveGame;
const uuid_1 = require("uuid");
const wikipediaUtils_1 = require("./wikipediaUtils");
let games = {};
async function createGame() {
    const { startingArticleUrl, endingArticleUrl, minSteps } = await (0, wikipediaUtils_1.getRandomStartAndEnd)();
    const game = {
        id: (0, uuid_1.v4)(),
        startingArticleUrl,
        endingArticleUrl,
        currentArticleUrl: startingArticleUrl,
        minSteps,
        stepsTaken: 0,
        hasWon: false
    };
    await saveGame(game);
    return game;
}
function getGameFromId(gameId) {
    const game = games[gameId];
    if (!game) {
        throw new Error(`Game with ID ${gameId} not found`);
    }
    return game;
}
async function saveGame(game) {
    games[game.id] = game;
    // In a real application, you would save to a database here.
    console.log(`Game saved: ${JSON.stringify(game)}`);
}
