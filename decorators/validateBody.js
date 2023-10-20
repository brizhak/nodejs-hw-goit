import HttpError from "../helpers/httpError.js";

const validateBody = (schema) => {
  const func = (req, _, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      console.log(req.body);
      return next(
        HttpError(400, "Error from Joi or another validation library")
      );
    }
    next();
  };
  return func;
};

export default validateBody;
