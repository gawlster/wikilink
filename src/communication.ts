import { getAuthStorage, updateAuthStorage } from "./authStorage";
import { appendErrorToStorage } from "./errorStorage";
import { updateGameStorage } from "./gameStorage";
import { ActiveGame, isValidActiveGame, isValidSeed } from "./serverTypes";
import { isEmptyObject } from "./utils";

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

async function handleErrorStorage(error: unknown) {
    const errorId = crypto.randomUUID();
    let errorMessage = "An unknown error occurred";
    let errorCode = "UNKNOWN_ERROR";
    if (error instanceof Error) {
        errorMessage = error.message;
        errorCode = error.name;
    }
    await appendErrorToStorage({ id: errorId, code: errorCode, message: errorMessage });
}

type ServerResponse<T> = {
    success: true;
    json: T;
} | {
    success: false;
    json: { error: string };
}

export async function doFetch<T>(url: string, options: RequestInit = {}, responseValidator: (json: any) => json is T): Promise<ServerResponse<T>> {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                ...await getHeadersWithAuth(options.headers)
            }
        });
        await storeAuthTokens(response);
        const json = await response.json();
        if (!response.ok) {
            if (!json || typeof json !== "object" || !("message" in json) || typeof json.message !== "string") {
                throw new Error(`Fetch failed with status ${response.status}: ${response.statusText}`);
            }
            throw new Error(json.message)
        }
        if (!responseValidator(json)) {
            throw new Error("Invalid response format from server.");
        }
        return { success: true, json };
    } catch (error) {
        console.error(`Error during fetch on endpoint ${url}: ${error}`);
        if (error instanceof Error && error.message.includes("Unauthorized")) {
            await updateAuthStorage({ accessToken: "", refreshToken: "" });
        }
        handleErrorStorage(error);
        return { success: false, json: { error: error instanceof Error ? error.message : "Unknown error" } };
    }

}

export async function startNewGame() {
    const response = await doFetch(
        `${getAPIRootUrl()}/active/start`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        },
        isValidActiveGame
    );
    if (response.success) {
        await updateGameStorage(response.json);
    }
    return response;
}

export async function startNewGameFromSeed(seedId: string) {
    const response = await doFetch(
        `${getAPIRootUrl()}/active/startFromSeed`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ seedId })
        },
        isValidActiveGame
    );
    if (response.success) {
        await updateGameStorage(response.json);
    }
    return response;
}

export async function validateWin(id: string, visitedUrls: string[]) {
    const response = await doFetch(
        `${getAPIRootUrl()}/active/validateWin`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id, visitedUrls })
        },
        isEmptyObject
    );
    if (response.success) {
        await updateGameStorage({ hasWon: true });
    }
    return response;
}

export async function login(email: string, password: string) {
    const response = await doFetch(
        `${getAPIRootUrl()}/auth/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        },
        isEmptyObject
    );
    return response;
}

export async function register(email: string, password: string, confirmPassword: string) {
    const response = await doFetch(
        `${getAPIRootUrl()}/auth/register`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password, confirmPassword })
        },
        isEmptyObject
    );
    return response;
}

export async function logout() {
    const response = await doFetch(
        `${getAPIRootUrl()}/auth/logout`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        },
        isEmptyObject
    )
    return response;
}

export async function createSeed(startingArticleUrl: string, endingArticleUrl: string, minSteps: number, category: string) {
    const response = await doFetch(
        `${getAPIRootUrl()}/admin/createSeed`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                startingArticleUrl,
                endingArticleUrl,
                minSteps,
                category
            })
        },
        isValidSeed
    );
    return response;
}

export async function createSeedFromCompletedGame(gameId: string) {
    const response = await doFetch(
        `${getAPIRootUrl()}/seed/createFromCompletedGame`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ gameId })
        },
        isValidSeed
    );
    if (response.success) {
        await updateGameStorage({ newlyCreatedSeed: response.json.id });
    }
    return response;
}

export async function requestResetPasswordCode(email: string) {
    const response = await doFetch(
        `${getAPIRootUrl()}/auth/resetPassword/sendCode`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        },
        isEmptyObject
    );
    if (response.success) {
        await updateAuthStorage({ resettingPasswordForEmail: email });
    }
    return response;
}

export async function resetPassword(email: string, otpCode: string, newPassword: string) {
    const response = await doFetch(
        `${getAPIRootUrl()}/auth/resetPassword/verifyCode`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, code: otpCode, newPassword })
        },
        isEmptyObject
    );
    if (response.success) {
        await updateAuthStorage({ resettingPasswordForEmail: "" });
    }
    return response;
}
