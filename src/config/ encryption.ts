import bcrypt from "bcryptjs";

// Load environment variable (e.g., PASSWORD_SALT_ROUNDS = 8)
const saltRounds = parseInt(process.env.PASSWORD_SALT_ROUNDS || "8", 10);

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(password, salt);
};

// Compare raw password with hashed one
export const comparePasswords = (
  password: string,
  hashed: string
): Promise<boolean> => bcrypt.compare(password, hashed);
