import express from 'express';
import startGame from './startGame';
import navigateLink from './navigateLink';
import deleteGame from './deleteGame';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.get('/', (req, res) => {
    res.send('Welcome to the Wikipedia Game API!');
});

app.get("/startGame", startGame);
app.post("/navigateLink", navigateLink);
app.delete("/deleteGame", deleteGame);
