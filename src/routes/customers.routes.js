import { Router } from "express";
import { addCustomer, getCustomerId, listCustomers, updateCustomerId } from "../controllers/customers.controllers.js";
import { validationSchema } from "../middlewares/validateSchema.middleware.js";
import { customerSchema } from "../schemas/customer.schema.js";
import { validateAddCustomer, validateUpdateCustomerId } from "../middlewares/customers.middlewares.js";

const customersRouter = Router();

customersRouter.get("/customers", listCustomers);
customersRouter.get("/customers/:id", getCustomerId);
customersRouter.post("/customers", validationSchema(customerSchema), validateAddCustomer, addCustomer);
customersRouter.put("/customers/:id", validationSchema(customerSchema), validateUpdateCustomerId, updateCustomerId);

export default customersRouter;