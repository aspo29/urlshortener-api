import httpError from 'http-errors';
// import  createHttpError  from 'http-errors';
import Validator from "validatorjs";

export type RequestBody = {[key: string]: unknown;};

const validateBody = async (
  body: RequestBody,
  validationSchema: Validator.Rules
): Promise<void> => {
  const validation = new Validator(body, validationSchema);
  if (validation.fails()) {
    const errors = validation.errors.all();
    const aggregatedErrors: string[] = [];
    Object.keys(errors).forEach((key) => {
      aggregatedErrors.push(validation.errors.first(key) as string);
    });
    throw httpError.BadRequest(aggregatedErrors.join(", "));
  } else {
    console.log("Validator passed");
  }
};


export const validateCreateShortURL = async (body: RequestBody) =>
  validateBody(body, {
    url: "required|url",
    id: "string|min:5|max:10|not_in:urls,visit,auth,login,register,docs",
  });


export const validateUpdateShortURL = async (body: RequestBody) =>
  validateBody(body, {
    url: "required|url",
    id: "string|min:5|max:10",
  });

export const validateRegister = async (body: RequestBody) =>
  validateBody(body, {
    username: "required|string|min:3|max:20",
    password: "required|string|min:6|max:100",
  });

export const validateLogin = async (body: RequestBody) =>
  validateBody(body, {
    username: "required|string",
    password: "required|string",
  });
