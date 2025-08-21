import { Router } from "express";
import { addRental, deleteRental, finalizeRental, listRentals } from "../controllers/rentals.controllers.js";

const rentalsRouter = Router();7

rentalsRouter.get("/rentals", listRentals);
rentalsRouter.post("/rentals", addRental);
rentalsRouter.post("/rentals/:id/return", finalizeRental);
rentalsRouter.delete("/rentals/:id", deleteRental);

export default rentalsRouter;