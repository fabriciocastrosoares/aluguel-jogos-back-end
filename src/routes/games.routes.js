import { Router } from "express";
import { addGames, listGames } from "../controllers/games.contollers.js";
import { validationSchema } from "../middlewares/validateSchema.middleware.js";
import { gameSchema } from "../schemas/game.schema.js";
import { validateAddGame } from "../middlewares/games.middlewares.js";

const gamesRouter = Router();

gamesRouter.get("/games", listGames);
gamesRouter.post("/games", validationSchema(gameSchema), validateAddGame, addGames);

export default gamesRouter;