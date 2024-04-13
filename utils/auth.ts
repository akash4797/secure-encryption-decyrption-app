import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as jose from "jose";

const jwtConfig = {
  secret: new TextEncoder().encode("Superman"),
};

const generateSalt = async (): Promise<string> => await bcrypt.genSalt(10);

/**
 * This function generates a salt using the bcryptjs library.
 * A salt is a random value that is used to make password hashing more secure.
 * It then takes a password, generates a salt, and uses the salt to hash the password.
 * The hashed password is returned as a Promise.
 *
 * @param {string} password - The password to be hashed.
 * @return {Promise<string>} A Promise that resolves to a string, the hashed password.
 */
const hashPassword = async (password: string): Promise<string> => {
  // Generate a salt using the bcryptjs library.
  const salt = await generateSalt();
  // Hash the password using the salt.
  // The salt is used to make the hash more secure.
  // The hashed password is returned as a Promise.
  return await bcrypt.hash(password, salt);
};

/**
 * This function compares a plain text password with a hashed password.
 * It takes a plain text password and a hashed password, and uses the bcryptjs
 * library to compare them. It returns a Promise that resolves to a boolean.
 * If the passwords match, the Promise resolves to true. If they don't, the
 * Promise resolves to false.
 *
 * @param {string} plainTextPassword - The password to compare, as plain text.
 * @param {string} hashedPassword - The password to compare, as a hash.
 * @return {Promise<boolean>} A Promise that resolves to a boolean. If the
 * passwords match, the Promise resolves to true. If they don't, the
 * Promise resolves to false.
 */
const comparePasswords = async (
  plainTextPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  // Compare the plain text password with the hashed password using the
  // bcryptjs library. The comparison is done asynchronously, so it returns
  // a Promise that resolves to a boolean.
  // The Promise resolves to true if the passwords match, and false if they
  // don't.
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

/**
 * This function generates a JSON Web Token (JWT) with the given user information.
 *
 * The function takes a user object as input, and uses the `jwt.sign` method from the
 * `jsonwebtoken` library to generate a JWT. The JWT is signed with a secret key,
 * which in this case is set to the string "Superman". The JWT payload contains
 * the user's `id` and `username` properties, so that this information can be accessed
 * when the JWT is verified later.
 *
 * The JWT is also set to expire after 1 hour (`expiresIn` option is set to "1h").
 *
 * The function returns the generated JWT as a string.
 *
 * @param {Object} user - The user object containing the user's `id` and `username`.
 * @return {string} The generated JWT as a string.
 */
const generateJWT = (user: any) => {
  // Generate a JWT with the user's id and username, signed with the secret key "Superman".
  // The JWT expires after 1 hour.
  const token = jwt.sign(
    {
      id: user.id, // Add user id to the JWT payload
      username: user.username, // Add user username to the JWT payload
    },
    "Superman",
    {
      expiresIn: "1h", // Set the expiry time for the token to 1 hour
    }
  );

  // Return the generated JWT as a string.
  return token;
};

/**
 * This function verifies a JSON Web Token (JWT) and returns the decoded
 * user data if the token is valid. If the token is not valid or an error
 * occurs during verification, it returns null.
 *
 * @param {string} token - The JWT to be verified.
 * @return {Object|null} - The decoded user data if the token is valid,
 *                         or null if the token is not valid or an error
 *                         occurs during verification.
 */
const verifyJWT = (token: string) => {
  try {
    // 1. We first attempt to verify the JWT using the `jose.jwtVerify`
    // method from the `jose` library. This method takes the JWT and a
    // secret key as input and returns the decoded user data if the
    // token is valid.
    const decoded = jose.jwtVerify(token, jwtConfig.secret);

    // 2. If the token is valid, the `jose.jwtVerify` method returns the
    // decoded user data. We then return this data.
    return decoded;
  } catch (error) {
    // 3. If an error occurs during verification, we log the error and
    // return null.
    console.error("Error verifying JWT token:", error);
    return null;
  }
};

export { hashPassword, comparePasswords, generateJWT, verifyJWT };
