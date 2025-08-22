import joi from "joi";

export const gameSchema = joi.object({
    name: joi.string().min(1).required(),
    image: joi.string().required(),
    stockTotal: joi.number().positive().required(),
    pricePerDay:joi.number().positive().precision(2).required()
});