"use strict";
async function createGame() {
    const game = {
        startingArticleUrl: "",
        endingArticleUrl: "",
        minSteps: -1,
        stepsTaken: 0,
        hasWon: false
    };
    await chrome.storage.local.set(game);
    return game;
}
