import { Router } from "express";
import { addGames, listGames } from "../controllers/games.contollers.js";

const gamesRouter = Router();

gamesRouter.get("/games", listGames);
gamesRouter.post("/games", addGames);

export default gamesRouter;