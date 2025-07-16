import { deleteGame, Game, gameKeys, navigteLink } from "./communication";

let game: Game = {
    id: "",
    startingArticleUrl: "",
    endingArticleUrl: "",
    currentArticleUrl: "",
    minSteps: -1,
    stepsTaken: 0,
    hasWon: false
}
let currentTabId: number = -1;

function isValidGame(gameData: any): gameData is Game {
    return gameData && typeof gameData.id === "string" &&
        typeof gameData.startingArticleUrl === "string" &&
        typeof gameData.endingArticleUrl === "string" &&
        typeof gameData.currentArticleUrl === "string" &&
        typeof gameData.minSteps === "number" &&
        typeof gameData.stepsTaken === "number" &&
        typeof gameData.hasWon === "boolean";
}

async function resetGame(): Promise<void> {
    await deleteGame({ gameId: game.id });
    game = {
        id: "",
        startingArticleUrl: "",
        endingArticleUrl: "",
        currentArticleUrl: "",
        minSteps: -1,
        stepsTaken: 0,
        hasWon: false
    };
    currentTabId = -1;
    await updateGameStorage();
}

async function updateGameStorage(): Promise<void> {
    await chrome.storage.local.set({
        ...game,
        currentTabId
    });
}

async function getGameFromStorage(): Promise<void> {
    const storedGame = await chrome.storage.local.get(gameKeys);
    if (isValidGame(storedGame)) {
        game = storedGame;
    } else {
        console.error("Invalid game data in storage:", storedGame);
        await resetGame();
    }
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    switch (message.type) {
        case "StartGame":
            const { gameData } = message;
            if (!isValidGame(gameData)) {
                console.error("Invalid message format for starting a game.");
                return;
            }
            game = gameData;
            chrome.tabs.create({ url: game.startingArticleUrl }, async (tab) => {
                if (chrome.runtime.lastError) {
                    console.error("Error opening tab:", chrome.runtime.lastError);
                    await resetGame();
                } else {
                    currentTabId = tab.id || -1;
                    await updateGameStorage();
                    chrome.notifications.create({
                        type: "list",
                        iconUrl: "../icons/icon128.png",
                        title: "Game Started",
                        message: "You have started a new game! Here are the rules:",
                        items: [
                            { title: "1", message: "Navigate by clicking links only." },
                            { title: "2", message: "Reach the target article in the least steps." },
                            { title: "3", message: "You may open another tab for information." },
                            { title: "4", message: "Once you reach the target article, you win!" },
                            { title: "5", message: "Closing the game tab ends the game." }
                        ]
                    });
                }
            });
            break;
        case "GiveUpGame":
            await resetGame();
            chrome.notifications.create({
                type: "basic",
                iconUrl: "../icons/icon128.png",
                title: "Game Over",
                message: "You have given up the game. You may start a new game from the extension popup."
            });
            break;
        default:
            console.warn("Unknown message type:", message.type);
            break;
    }
});

chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
    await getGameFromStorage();
    if (game.hasWon) {
        return;
    }
    if (tabId === currentTabId) {
        chrome.notifications.create({
            type: "basic",
            iconUrl: "../icons/icon128.png",
            title: "Game Over",
            message: "You have closed the game tab. The game has ended. You may start a new game from the extension popup."
        })
        await resetGame();
    }
});

chrome.webNavigation.onCommitted.addListener(async (details) => {
    await getGameFromStorage();
    if (game.hasWon || details.tabId !== currentTabId) {
        return;
    }
    if (details.transitionType !== "link") {
        await resetGame();
        chrome.notifications.create({
            type: "basic",
            iconUrl: "../icons/icon128.png",
            title: "Invalid Navigation",
            message: "Game over! You may only navigate via links within the game tab. Please start a new game from the extension popup."
        });
        return;
    }
    const newUrl = details.url;
    const newGameData = await navigteLink({
        gameId: game.id,
        oldPageUrl: game.currentArticleUrl,
        newPageUrl: newUrl
    })
    if (!isValidGame(newGameData)) {
        console.error("Invalid game data received from server:", newGameData);
        await resetGame();
        return;
    }
    game = newGameData;
    await updateGameStorage();
    if (game.hasWon) {
        chrome.notifications.create({
            type: "basic",
            iconUrl: "../icons/icon128.png",
            title: "Congratulations!",
            message: `You have reached the target article: ${decodeURIComponent(newUrl.split("/").pop() || "")}. You win!`
        });
    }
});
