import { getNormalizedTitle } from "./utils";

export function gameStartedNotification(startingArticleUrl: string, endingArticleUrl: string, minSteps: number) {
    chrome.notifications.create({
        type: "basic",
        iconUrl: "../icons/icon128.png",
        title: "Game Started",
        message: `You have started a new game! Try to get from ${getNormalizedTitle(startingArticleUrl)} to ${getNormalizedTitle(endingArticleUrl)}. The best path is ${minSteps} steps.`,
    });
}

export function gameWonNotification(steps: number) {
    chrome.notifications.create({
        type: "basic",
        iconUrl: "../icons/icon128.png",
        title: "Congratulations!",
        message: `You won! Your score is ${steps}. Open the popup for more details and to start a new game.`,
    });
}

export function invalidGameNotification() {
    chrome.notifications.create({
        type: "basic",
        iconUrl: "../icons/icon128.png",
        title: "Error",
        message: "Something went wrong. Your score will be discarded. Please ensure you read and follow all the rules of the game. Please try again."
    });
}

export function closedTabNotification() {
    chrome.notifications.create({
        type: "basic",
        iconUrl: "../icons/icon128.png",
        title: "Game Over",
        message: "You have closed the game tab. The game has ended. You may start a new game from the extension popup."
    })
}
