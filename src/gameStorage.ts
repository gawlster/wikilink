export type GameStorage = {
    id: string;
    startingArticleUrl: string;
    endingArticleUrl: string;
    minSteps: number;
    visitedUrls: string[];
    hasWon: boolean;
    tabId: number;
    createdFromSeed?: string;
    newlyCreatedSeed?: string;
}
export const gameStorageKeys = [
    "id",
    "startingArticleUrl",
    "endingArticleUrl",
    "minSteps",
    "visitedUrls",
    "hasWon",
    "tabId",
    "createdFromSeed",
    "newlyCreatedSeed"
] as const;

export async function updateGameStorage(newStorage: Partial<GameStorage>): Promise<GameStorage> {
    const currentStorage = await chrome.storage.local.get(gameStorageKeys);
    const updatedStorage = {
        ...currentStorage,
        ...newStorage
    } as GameStorage;

    await chrome.storage.local.set(updatedStorage);
    return updatedStorage;
}

export async function getGameStorage(): Promise<GameStorage> {
    const baseStorage: GameStorage = {
        id: "",
        startingArticleUrl: "",
        endingArticleUrl: "",
        minSteps: -1,
        visitedUrls: [],
        hasWon: false,
        tabId: -1,
        createdFromSeed: "",
        newlyCreatedSeed: ""
    }
    const storedData = await chrome.storage.local.get(gameStorageKeys);
    return {
        ...baseStorage,
        ...storedData
    } as GameStorage;
}

export async function clearGameStorage(): Promise<void> {
    const baseStorage: GameStorage = {
        id: "",
        startingArticleUrl: "",
        endingArticleUrl: "",
        minSteps: -1,
        visitedUrls: [],
        hasWon: false,
        tabId: -1,
        createdFromSeed: "",
        newlyCreatedSeed: ""
    }
    await chrome.storage.local.set(baseStorage);
}
