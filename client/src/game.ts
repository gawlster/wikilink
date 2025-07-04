export type Article = {
    title: string;
    url: string;
}

export class Game {
    startingArticle: Article | null = null;
    endingArticle: Article | null = null;
    currentArticle: Article | null = null;
    totalSteps: number = 5;
    stepsRemaining: number = 5;
    stepsTaken: Article[] = [];

    gameOver: boolean = false;

    ResetGame(): void {
        this.startingArticle = null;
        this.endingArticle = null;
        this.currentArticle = null;
        this.totalSteps = 5;
        this.stepsRemaining = 5;
        this.gameOver = false;
    }

    IsValidGame(): boolean {
        return (
            this.startingArticle !== null &&
            this.startingArticle.title !== "" &&
            this.startingArticle.url !== "" &&
            this.endingArticle !== null &&
            this.endingArticle.title !== "" &&
            this.endingArticle.url !== "" &&
            this.totalSteps > 0
        )
    }

    ParseGameData(data: object): void {
        if (typeof data !== "object" || data === null) {
            throw new Error("Invalid data: not an object.");
        }

        const requiredKeys = [
            "startingArticle",
            "endingArticle",
            "currentArticle",
            "totalSteps",
            "stepsRemaining",
            "stepsTaken",
            "gameOver"
        ];
        const dataKeys = Object.keys(data);
        for (const key of requiredKeys) {
            if (!(key in data)) {
                throw new Error(`Missing required field: ${key}`);
            }
        }
        for (const key of dataKeys) {
            if (!requiredKeys.includes(key)) {
                throw new Error(`Unknown field in game data: ${key}`);
            }
        }

        const articleFields = ["title", "url"];
        const validateArticle = (a: any): Article => {
            if (typeof a !== "object" || a === null) {
                throw new Error("Invalid article format");
            }
            for (const field of articleFields) {
                if (typeof a[field] !== "string" || a[field].trim() === "") {
                    throw new Error(`Invalid or missing field '${field}' in article`);
                }
            }
            return { title: a.title, url: a.url };
        };

        const parsed = data as any;

        this.startingArticle = validateArticle(parsed.startingArticle);
        this.endingArticle = validateArticle(parsed.endingArticle);
        this.currentArticle = validateArticle(parsed.currentArticle);

        if (typeof parsed.totalSteps !== "number" || parsed.totalSteps <= 0) {
            throw new Error("Invalid totalSteps value");
        }

        if (typeof parsed.stepsRemaining !== "number" || parsed.stepsRemaining < 0 || parsed.stepsRemaining > parsed.totalSteps) {
            throw new Error("Invalid stepsRemaining value");
        }

        if (!Array.isArray(parsed.stepsTaken)) {
            throw new Error("stepsTaken must be an array");
        }

        this.stepsTaken = parsed.stepsTaken.map(validateArticle);

        if (typeof parsed.gameOver !== "boolean") {
            throw new Error("gameOver must be a boolean");
        }

        this.totalSteps = parsed.totalSteps;
        this.stepsRemaining = parsed.stepsRemaining;
        this.gameOver = parsed.gameOver;
    }

    GetGameData(): object {
        return {
            startingArticle: this.startingArticle,
            endingArticle: this.endingArticle,
            currentArticle: this.currentArticle,
            totalSteps: this.totalSteps,
            stepsRemaining: this.stepsRemaining,
            stepsTaken: this.stepsTaken,
            gameOver: this.gameOver
        };
    }
}
