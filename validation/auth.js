const Joi = require("joi");

const schema = Joi.object({
  username: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().min(6).required(),
  lastName: Joi.string().min(6).required(),
});

const validateRegister = (body) => {
  return schema.validate(body);
};

module.exports.validateRegister = validateRegister;
