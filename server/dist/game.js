"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGame = createGame;
const uuid_1 = require("uuid");
const wikipediaUtils_1 = require("./wikipediaUtils");
async function createGame() {
    const { startingArticleUrl, endingArticleUrl, minSteps } = await (0, wikipediaUtils_1.getRandomStartAndEnd)();
    const game = {
        id: (0, uuid_1.v4)(),
        startingArticleUrl,
        endingArticleUrl,
        minSteps,
        stepsTaken: 0,
        hasWon: false
    };
    return game;
}
