import { getAuthStorage, updateAuthStorage } from "./authStorage";
import { updateGameStorage } from "./gameStorage";
import { isValidActiveGame } from "./serverTypes";

function getAPIRootUrl() {
    return "https://wikilink-mu.vercel.app/api"
    // return "http://localhost:3000/api"
}

async function getHeadersWithAuth(headers: object = {}) {
    const { accessToken, refreshToken } = await getAuthStorage();
    return {
        ...headers,
        "Authorization": `Bearer ${accessToken}`,
        "x-refresh-token": refreshToken
    }
}

async function storeAuthTokens(response: Response) {
    const accessToken = response.headers.get("Authorization")?.split(" ")[1] || "";
    const refreshToken = response.headers.get("x-refresh-token") || "";
    await updateAuthStorage({ accessToken, refreshToken });
}

export async function startNewGame() {
    try {
        const response = await fetch(`${getAPIRootUrl()}/active/start`, {
            method: "POST",
            headers: await getHeadersWithAuth({
                "Content-Type": "application/json"
            })
        });
        await storeAuthTokens(response);
        if (!response.ok) {
            throw new Error(`Failed to start new game: ${response.statusText}`);
        }
        const activeGame = await response.json();
        if (!isValidActiveGame(activeGame)) {
            throw new Error("Invalid response from server when starting a new game.");
        }
        await updateGameStorage(activeGame);
        return activeGame;
    } catch (error) {
        console.error("Error starting new game:", error);
        if (error instanceof Error && error.message.includes("Unauthorized")) {
            await updateAuthStorage({ accessToken: "", refreshToken: "" });
        }
        throw error;
    }
}

export async function startNewGameFromSeed(seedId: string) {
    try {
        const response = await fetch(`${getAPIRootUrl()}/active/startFromSeed`, {
            method: "POST",
            headers: await getHeadersWithAuth({
                "Content-Type": "application/json"
            }),
            body: JSON.stringify({ seedId })
        });
        await storeAuthTokens(response);
        if (!response.ok) {
            throw new Error(`Failed to start new game from seed: ${response.statusText}`);
        }
        const activeGame = await response.json();
        if (!isValidActiveGame(activeGame)) {
            throw new Error("Invalid response from server when starting a new game from seed.");
        }
        await updateGameStorage(activeGame);
        return activeGame;
    } catch (error) {
        console.error("Error starting new game from seed: ", error);
        if (error instanceof Error && error.message.includes("Unauthorized")) {
            await updateAuthStorage({ accessToken: "", refreshToken: "" });
        }
        throw error;
    }
}

export async function validateWin(id: string, visitedUrls: string[]) {
    try {
        const response = await fetch(`${getAPIRootUrl()}/active/validateWin`, {
            method: "POST",
            headers: await getHeadersWithAuth({
                "Content-Type": "application/json"
            }),
            body: JSON.stringify({ id, visitedUrls })
        });
        await storeAuthTokens(response);
        if (!response.ok) {
            throw new Error(`Failed to validate win: ${response.statusText}`);
        }
        await updateGameStorage({ hasWon: true });
    } catch (error) {
        console.error("Error validating win:", error);
        if (error instanceof Error && error.message.includes("Unauthorized")) {
            await updateAuthStorage({ accessToken: "", refreshToken: "" });
        }
        throw error;
    }
}

export async function login(email: string, password: string) {
    try {
        const response = await fetch(`${getAPIRootUrl()}/auth/login`, {
            method: "POST",
            headers: await getHeadersWithAuth({
                "Content-Type": "application/json"
            }),
            body: JSON.stringify({ email, password })
        });
        await storeAuthTokens(response);
        if (!response.ok) {
            throw new Error(`Login failed: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error during login:", error);
        if (error instanceof Error && error.message.includes("Unauthorized")) {
            await updateAuthStorage({ accessToken: "", refreshToken: "" });
        }
        throw error;
    }
}

export async function register(email: string, password: string, confirmPassword: string) {
    if (password !== confirmPassword) {
        throw new Error("Passwords do not match.");
    }
    try {
        const response = await fetch(`${getAPIRootUrl()}/auth/register`, {
            method: "POST",
            headers: await getHeadersWithAuth({
                "Content-Type": "application/json"
            }),
            body: JSON.stringify({ email, password, confirmPassword })
        });
        await storeAuthTokens(response);
        if (!response.ok) {
            throw new Error(`Registration failed: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error during registration:", error);
        if (error instanceof Error && error.message.includes("Unauthorized")) {
            await updateAuthStorage({ accessToken: "", refreshToken: "" });
        }
        throw error;
    }
}

export async function createSeed(startingArticleUrl: string, endingArticleUrl: string, minSteps: number, category: string) {
    try {
        const response = await fetch(`${getAPIRootUrl()}/admin/createSeed`, {
            method: "POST",
            headers: await getHeadersWithAuth({
                "Content-Type": "application/json"
            }),
            body: JSON.stringify({
                startingArticleUrl,
                endingArticleUrl,
                minSteps,
                category
            })
        });
        await storeAuthTokens(response);
        if (!response.ok) {
            throw new Error(`Failed to create seed: ${response.statusText}`);
        }
        const seed = await response.json();
        if (!seed || !seed.id) {
            throw new Error("Invalid seed response from server.");
        }
        return seed;
    } catch (error) {
        console.error("Error creating seeded game:", error);
        if (error instanceof Error && error.message.includes("Unauthorized")) {
            await updateAuthStorage({ accessToken: "", refreshToken: "" });
        }
        throw error;
    }
}

export async function createSeedFromCompletedGame(gameId: string) {
    try {
        const response = await fetch(`${getAPIRootUrl()}/seed/createFromCompletedGame`, {
            method: "POST",
            headers: await getHeadersWithAuth({
                "Content-Type": "application/json"
            }),
            body: JSON.stringify({ gameId })
        });
        await storeAuthTokens(response);
        if (!response.ok) {
            throw new Error(`Failed to create seed from completed game: ${response.statusText}`);
        }
        const seed = await response.json();
        if (!seed || !seed.id) {
            throw new Error("Invalid seed response from server.");
        }
        await updateGameStorage({ newlyCreatedSeed: seed.id });
        return seed;
    } catch (error) {
        console.error("Error creating seed from completed game:", error);
        if (error instanceof Error && error.message.includes("Unauthorized")) {
            await updateAuthStorage({ accessToken: "", refreshToken: "" });
        }
        throw error;
    }
}
