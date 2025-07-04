type Game = {
    id: string;
    startingArticleUrl: string;
    endingArticleUrl: string;
    minSteps: number;
    stepsTaken: number;
    hasWon: boolean;
}

async function createGame(): Promise<Game> {
    const game: Game = {
        startingArticleUrl: "",
        endingArticleUrl: "",
        minSteps: -1,
        stepsTaken: 0,
        hasWon: false
    };
    await chrome.storage.local.set(game);
    return game;
}
