import joi from 'joi';

export const userSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
    name: joi.string().min(8).required(),
    phoneNumber: joi.string().pattern(/^[0-9]{10,15}$/).required()
});