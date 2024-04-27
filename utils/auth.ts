import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as jose from "jose";

const jwtConfig = {
  secret: new TextEncoder().encode(process.env.JWT_SECRET),
};

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
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET || "Superman",
    { expiresIn: "1h" }
  );
  return token;
};

const verifyJWT = (token: string) => {
  try {
    const decoded = jose.jwtVerify(token, jwtConfig.secret);
    return decoded;
  } catch (error) {
    console.error("Error verifying JWT token:", error);
    return null;
  }
};

export { hashPassword, comparePasswords, generateJWT, verifyJWT };
