export type AuthStorage = {
    accessToken: string;
    refreshToken: string;
}
export const authStorageKeys = [
    "accessToken",
    "refreshToken"
] as const;

export async function updateAuthStorage(newStorage: Partial<AuthStorage>): Promise<AuthStorage> {
    const currentStorage = await chrome.storage.local.get(authStorageKeys);
    const updatedStorage = {
        ...currentStorage,
        ...newStorage
    } as AuthStorage;

    await chrome.storage.local.set(updatedStorage);
    return updatedStorage;
}

export async function getAuthStorage(): Promise<AuthStorage> {
    const baseStorage: AuthStorage = {
        accessToken: "",
        refreshToken: ""
    }
    const storedData = await chrome.storage.local.get(authStorageKeys);
    return {
        ...baseStorage,
        ...storedData
    } as AuthStorage;
}

export async function clearAuthStorage(): Promise<void> {
    const baseStorage: AuthStorage = {
        accessToken: "",
        refreshToken: ""
    }
    await chrome.storage.local.set(baseStorage);
}
