import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateSalt = async (): Promise<string> => await bcrypt.genSalt(10);

const hashPassword = async (password: string): Promise<string> => {
  const salt = await generateSalt();
  return await bcrypt.hash(password, salt);
};

const comparePasswords = async (
  plainTextPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

const generateJWT = (user: any) => {
  const token = jwt.sign({ id: user.id, username: user.username }, "Superman", {
    expiresIn: "1h", // Set expiry time for the token (e.g., 1 hour)
  });
  return token;
};

export { hashPassword, comparePasswords, generateJWT };
