import express from 'express';
const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.send('Hello from Express with TypeScript!');
});
app.get("/startGame", async (req, res) => {
    try {
        const gameData = await getRandomStartAndEnd();
        res.json(gameData);
    }
    catch (error) {
        console.error("Error starting game:", error);
        res.status(500).json({ error: "Failed to start game" });
    }
});
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
