export type ActiveGame = {
    id: string;
    startingArticleUrl: string;
    endingArticleUrl: string;
    minSteps: number;
}
export function isValidActiveGame(game: any): game is ActiveGame {
    return (
        typeof game === 'object' &&
        game !== null &&
        typeof game.id === 'string' &&
        typeof game.startingArticleUrl === 'string' &&
        typeof game.endingArticleUrl === 'string' &&
        typeof game.minSteps === 'number'
    )
}
export const activeGameKeys = ["id", "startingArticleUrl", "endingArticleUrl", "minSteps"] as const;

export type CompletedGame = {
    id: string;
    startingArticleUrl: string;
    endingArticleUrl: string;
    minSteps: number;
    steps: string[];
    completedAt: string; // ISO date string
};
export function isValidCompletedGame(game: any): game is CompletedGame {
    return (
        typeof game === 'object' &&
        game !== null &&
        typeof game.id === 'string' &&
        typeof game.startingArticleUrl === 'string' &&
        typeof game.endingArticleUrl === 'string' &&
        typeof game.minSteps === 'number' &&
        Array.isArray(game.steps) &&
        game.steps.every(step => typeof step === 'string') &&
        typeof game.completedAt === 'string'
    );
}
export const completedGameKeys = [
    "id",
    "startingArticleUrl",
    "endingArticleUrl",
    "minSteps",
    "steps",
    "completedAt"
] as const;
