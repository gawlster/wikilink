import { isValidActiveGame } from "./serverTypes";

function getAPIRootUrl() {
    // return "https://wikilink-mu.vercel.app/api"
    return "http://localhost:3000/api"
}

export async function startNewGame() {
    try {
        const response = await fetch(`${getAPIRootUrl()}/active/start`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to start new game: ${response.statusText}`);
        }
        const activeGame = await response.json();
        if (!isValidActiveGame(activeGame)) {
            throw new Error("Invalid response from server when starting a new game.");
        }
        await chrome.storage.local.set(activeGame)
        return activeGame;
    } catch (error) {
        console.error("Error starting new game:", error);
        throw error;
    }
}

export async function validateWin(id: string, visitedUrls: string[]) {
    try {
        const response = await fetch(`${getAPIRootUrl()}/active/validateWin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id, visitedUrls })
        });
        if (!response.ok) {
            throw new Error(`Failed to validate win: ${response.statusText}`);
        }
        await chrome.storage.local.set({ hasWon: true });
    } catch (error) {
        console.error("Error validating win:", error);
        throw error;
    }
}
