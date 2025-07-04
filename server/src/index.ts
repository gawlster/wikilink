import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Hello from Express with TypeScript!');
});

app.get("/startGame", async (req: Request, res: Response) => {
    try {
        const gameData = await getRandomStartAndEnd();
        res.json(gameData);
    } catch (error) {
        console.error("Error starting game:", error);
        res.status(500).json({ error: "Failed to start game" });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
