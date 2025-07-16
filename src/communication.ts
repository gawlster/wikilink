export type Game = {
    id: string;
    startingArticleUrl: string;
    endingArticleUrl: string;
    currentArticleUrl: string;
    minSteps: number;
    stepsTaken: number;
    hasWon: boolean;
}
const throwawayGame: Game = {
    id: "",
    startingArticleUrl: "",
    endingArticleUrl: "",
    currentArticleUrl: "",
    minSteps: -1,
    stepsTaken: 0,
    hasWon: false
}
export const gameKeys = Object.keys(throwawayGame) as (keyof Game)[];

export async function startNewGame() {
    return await makeFetch<Game>("startGame");
}

export async function navigteLink(body: { gameId: string, oldPageUrl: string, newPageUrl: string }) {
    return await makeFetch<Game>("navigateLink", body);
}

export async function deleteGame(body: { gameId: string }) {
    console.log("In deleteGame, body:", body);
    return await makeFetch<{}>("deleteGame", body);
}

const endpoints = {
    startGame: {
        endpoint: "/api/startGame",
        method: "POST"
    },
    navigateLink: {
        endpoint: "/api/navigateLink",
        method: "POST"
    },
    deleteGame: {
        endpoint: "/api/deleteGame",
        method: "DELETE"
    }
} as const;

type Endpoints = keyof typeof endpoints;
function getEndpoint(endpoint: Endpoints) {
    // TODO: Use environment variable for the target
    // const target = "https://wikilink-mu.vercel.app";
    const target = "http://localhost:3000";
    return `${target}${endpoints[endpoint].endpoint}`;
}
function getOptions(endpoint: Endpoints, body?: object) {
    console.log("In getOptions, body: ", body);
    return {
        method: endpoints[endpoint].method,
        headers: {
            "Content-Type": "application/json"
        },
        body: body ? JSON.stringify(body) : undefined
    };
}

async function makeFetch<T>(endpoint: Endpoints, body?: object): Promise<T> {
    try {
        const response = await fetch(getEndpoint(endpoint), getOptions(endpoint, body));
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data as T;
    } catch (error) {
        console.error("Error making fetch request:", error);
        throw error;
    }
}
