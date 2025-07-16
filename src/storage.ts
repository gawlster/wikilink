export type Storage = {
    id: string;
    startingArticleUrl: string;
    endingArticleUrl: string;
    minSteps: number;
    visitedUrls: string[];
    hasWon: boolean;
    tabId: number;
}
export const storageKeys = [
    "id",
    "startingArticleUrl",
    "endingArticleUrl",
    "minSteps",
    "visitedUrls",
    "hasWon",
    "tabId"
] as const;

export async function updateStorage(newStorage: Partial<Storage>): Promise<Storage> {
    const currentStorage = await chrome.storage.local.get(storageKeys);
    const updatedStorage: Storage = {
        ...currentStorage,
        ...newStorage
    } as Storage;

    await chrome.storage.local.set(updatedStorage);
    return updatedStorage;
}

export async function getStorage(): Promise<Storage> {
    const baseStorage: Storage = {
        id: "",
        startingArticleUrl: "",
        endingArticleUrl: "",
        minSteps: -1,
        visitedUrls: [],
        hasWon: false,
        tabId: -1
    }
    const storedData = await chrome.storage.local.get(storageKeys);
    return {
        ...baseStorage,
        ...storedData
    } as Storage;
}

export async function clearStorage(): Promise<void> {
    await chrome.storage.local.clear();
}
