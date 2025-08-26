import { Router } from "express";
import { addRental, deleteRental, finalizeRental, listRentals } from "../controllers/rentals.controllers.js";
import { validationSchema } from "../middlewares/validateSchema.middleware.js";
import { rentalSchema } from "../schemas/rental.schema.js";
import { validateAddRental, validateDeleteRental, validateFinalizaRental } from "../middlewares/rentals.middlewares.js";

const rentalsRouter = Router();7

rentalsRouter.get("/rentals", listRentals);
rentalsRouter.post("/rentals",validationSchema(rentalSchema), validateAddRental, addRental);
rentalsRouter.post("/rentals/:id/return", validateFinalizaRental, finalizeRental);
rentalsRouter.delete("/rentals/:id", validateDeleteRental, deleteRental);

export default rentalsRouter;