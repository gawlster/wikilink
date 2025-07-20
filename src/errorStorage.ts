export type Error = {
    id: string;
    code: string;
    message: string;
}

export type ErrorStorage = {
    errors: Error[];
}

export const errorStorageKeys = [
    "errors"
] as const;

export async function appendErrorToStorage(error: Error): Promise<ErrorStorage> {
    const currentStorage = await chrome.storage.local.get(errorStorageKeys);
    const updatedErrors = [...(currentStorage.errors || []), error];

    const updatedStorage: ErrorStorage = {
        errors: updatedErrors
    };

    await chrome.storage.local.set(updatedStorage);
    return updatedStorage;
}

export async function dismissErrorFromStorage(errorId: string): Promise<ErrorStorage> {
    const currentStorage = await chrome.storage.local.get(errorStorageKeys);
    const updatedErrors = (currentStorage.errors || []).filter((error: Error) => error.id !== errorId);

    const updatedStorage: ErrorStorage = {
        errors: updatedErrors
    };

    await chrome.storage.local.set(updatedStorage);
    return updatedStorage;
}

export async function dismissAllErrorsFromStorage(): Promise<ErrorStorage> {
    const baseStorage: ErrorStorage = {
        errors: []
    };
    await chrome.storage.local.set(baseStorage);
    return baseStorage;
}

export async function getErrorStorage(): Promise<ErrorStorage> {
    const baseStorage: ErrorStorage = {
        errors: []
    };
    const storedData = await chrome.storage.local.get(errorStorageKeys);
    return {
        ...baseStorage,
        ...storedData
    } as ErrorStorage;
}
