import { Router } from "express";
import { addCustomer, getCustomerId, listCustomers, updateCustomerId } from "../controllers/customers.controllers.js";
import { validationSchema } from "../middlewares/validateSchema.middleware.js";
import { customerSchema } from "../schemas/customer.schema.js";

const customersRouter = Router();

customersRouter.get("/customers", listCustomers);
customersRouter.get("/customers/:id", getCustomerId);
customersRouter.post("/customers", validationSchema(customerSchema), addCustomer);
customersRouter.put("/customers/:id", validationSchema(customerSchema), updateCustomerId);

export default customersRouter;