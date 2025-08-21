import { Router } from "express";
import { addCustomer, getCustomerId, listCustomers, updateCustomerId } from "../controllers/customers.controllers.js";

const customersRouter = Router();

customersRouter.get("/customers", listCustomers);
customersRouter.get("/customers/:id", getCustomerId);
customersRouter.post("/customers", addCustomer);
customersRouter.put("/customers/:id", updateCustomerId);

export default customersRouter;