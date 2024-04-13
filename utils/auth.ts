import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as jose from "jose";

const jwtConfig = {
  secret: new TextEncoder().encode("Superman"),
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
  const token = jwt.sign({ id: user.id, username: user.username }, "Superman", {
    expiresIn: "1h", // Set expiry time for the token (e.g., 1 hour)
  });
  return token;
};

const verifyJWT = (token: string) => {
  try {
    // 2. Verify the token using your secret key
    const decoded = jose.jwtVerify(token, jwtConfig.secret); // Replace 'Superman' with your actual secret key
    return decoded; // Returns decoded user data if valid
  } catch (error) {
    console.error("Error verifying JWT token:", error);
    return null; // Return null on invalid token or errors
  }
};

export { hashPassword, comparePasswords, generateJWT, verifyJWT };
