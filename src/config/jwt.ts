import jwt from "jsonwebtoken";
import HttpError from "http-errors";

const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY as string;

interface JWTPayload {
  [key: string]: unknown;
}

export const generateToken = async (payload: JWTPayload): Promise<string> => {
  return jwt.sign(payload, JWT_PRIVATE_KEY, {
    expiresIn: "365d", // 1 year
  });
};

export const validateToken = async (token: string): Promise<JWTPayload> => {
  try {
    const decoded = jwt.verify(token, JWT_PRIVATE_KEY);
    return decoded as JWTPayload;
  } catch {
    throw new HttpError.Unauthorized("Please provide a valid token");
  }
};
