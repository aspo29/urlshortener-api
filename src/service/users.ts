import knex from "../config/knex";
import HttpError from "http-errors";
import { validateLogin, validateRegister } from "./validations";
import { comparePasswords, hashPassword } from "../config/ encryption";
import { User } from "../types";
import { generateToken } from "../config/jwt";

interface RegisterBody {
  username: string;
  password: string;
  [key: string]: unknown;
}

const getUser = async (username: string): Promise<User | undefined> => {
  return knex<User>("users")
    .whereRaw("LOWER(username) = LOWER(?)", [username])
    .first();
};

export const register = async (body: RegisterBody) => {
  // 1. Validate input
  validateRegister(body);

  // 2. Normalize username to lowercase
  const normalizedUsername = body.username.toLowerCase();

  // 3. Check if user already exists (case-insensitive)
  const existingUser = await getUser(normalizedUsername);

  if (existingUser) {
    throw new HttpError.Conflict("Username already exists");
  }

  // Hash the password before storing
  const hashedPassword = await hashPassword(body.password);

  // 4. Insert new user into DB
  const [user] = await knex("users")
    .insert({
      username: normalizedUsername,
      password: hashedPassword, 
    })
    .returning(["id", "username"]);

  return user;
};


export const login = async (body: RegisterBody) => {
  // 1. Validate login input
  validateLogin(body);

  // 2. Fetch user by username
  const user = await getUser(body.username);

  if (!user) {
    throw new HttpError.Unauthorized("Username or password is incorrect");
  }

  // 3. Compare password hashes
  const passwordMatches = await comparePasswords(body.password, user.password);

  if (!passwordMatches) {
    throw new HttpError.Unauthorized( "Username or password is incorrect");
  }

  const token = await generateToken({ id: user.id });

  return {
    user: {
      id: user.id,
      username: user.username,
      created_at: user.created_at,
      updated_at: user.updated_at,
    },
    token,
  };
};