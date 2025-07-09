"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGame = createGame;
exports.getGameFromId = getGameFromId;
exports.saveGame = saveGame;
exports.deleteGame = deleteGame;
const uuid_1 = require("uuid");
const wikipediaUtils_1 = require("./wikipediaUtils");
const redis_1 = require("@upstash/redis");
const redis = new redis_1.Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});
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
async function getGameFromId(gameId) {
    const raw = await redis.get(`game:${gameId}`);
    if (typeof raw !== "object" || raw === null || !isValidGame(raw)) {
        throw new Error(`Game with ID ${gameId} not found or malformed`);
    }
    return raw;
}
function isValidGame(game) {
    return typeof game.id === 'string' &&
        typeof game.startingArticleUrl === 'string' &&
        typeof game.endingArticleUrl === 'string' &&
        typeof game.currentArticleUrl === 'string' &&
        typeof game.minSteps === 'number' &&
        typeof game.stepsTaken === 'number' &&
        typeof game.hasWon === 'boolean';
}
async function saveGame(game) {
    await redis.set(`game:${game.id}`, JSON.stringify(game), { ex: 3600 });
    console.log(`Game saved: ${JSON.stringify(game)}`);
}
async function deleteGame(gameId) {
    await redis.del(`game:${gameId}`);
    console.log(`Game deleted: ${gameId}`);
}
