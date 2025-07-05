import { v4 as uuidv4 } from 'uuid';
import { getRandomStartAndEnd } from "./wikipediaUtils";

type Game = {
    id: string;
    startingArticleUrl: string;
    endingArticleUrl: string;
    minSteps: number;
    stepsTaken: number;
    hasWon: boolean;
}

export async function createGame(): Promise<Game> {
    const { startingArticleUrl, endingArticleUrl, minSteps } = await getRandomStartAndEnd();
    const game: Game = {
        id: uuidv4(),
        startingArticleUrl,
        endingArticleUrl,
        minSteps,
        stepsTaken: 0,
        hasWon: false
    };
    return game;
}
