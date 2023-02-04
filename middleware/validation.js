const Joi = require("joi");

exports.signUpValidation = ({ name, email, password, address, mobile }) => {
    let schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        address: Joi.string().required(),
        mobile: Joi.number().required(),
    });
    let { error } = schema.validate({ name, email, password, address, mobile });
    return error;
};
exports.productValidation = (body) => {
    let { title, imageUrl, description, price } = body;
    let schema = Joi.object({
        title: Joi.string().min(4).required(),
        imageUrl: Joi.string().required(),
        description: Joi.string().min(4).required(),
        price: Joi.number().required(),
    });
    let { error } = schema.validate(body);
    return error;
};
