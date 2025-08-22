import joi from "joi";

export const customerSchema = joi.object({
    name: joi.string().min(1).required(),
    phone: joi.string().pattern(/^\d{10,11}$/).required(),
    cpf: joi.string().pattern(/^\d{11}$/).required(),
    birthday:joi.date().iso().required()
});