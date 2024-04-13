import axios from "axios";
import { cookies } from "next/headers";
import UserInfo from "./UserInfo";

/**
 * getUser is an asynchronous function that takes a token (a string representing a JWT)
 * as its parameter and returns a Promise that resolves to an Axios response object,
 * or null if an error occurs.
 *
 * This function is used to fetch user information from the API.
 *
 * The function uses the axios library to make a GET request to the '/api/userinfo' endpoint
 * of the API, passing the token in the headers as an 'Authorization' field.
 *
 * If the request is successful, the function returns the Axios response object.
 *
 * If an error occurs (such as network issues or the server returning a non-200 status code),
 * the function returns null.
 *
 * @param {string} token - The JWT token to authenticate the user
 * @return {Promise<Object|null>} The Axios response object, or null if an error occurred
 */
export const getUser = async (token: string) => {
  try {
    // Make a GET request to the '/api/userinfo' endpoint of the API, passing the token
    // in the headers as an 'Authorization' field.
    const response = await axios.get("http://localhost:3000/api/userinfo", {
      headers: {
        Authorization: token,
      },
    });
    // If the request is successful, return the Axios response object.
    return response;
  } catch (error) {
    // If an error occurs, return null.
    return null;
  }
};

// This is the Home function, which is the default export of the module.
// It is an asynchronous function that returns JSX (React elements) to be rendered by Next.js.
// It is the root component of our application.

// The function begins by getting the "access-token" cookie from the request headers.
// The cookie is an HTTP cookie that contains a JWT (JSON Web Token), which is used for authentication.

// The function then calls the 'getUser' function, passing the token as a parameter.
// The 'getUser' function is an asynchronous function that makes a GET request to the '/api/userinfo' endpoint of the API,
// passing the token in the headers as an 'Authorization' field.

// If the request is successful, the 'getUser' function returns the Axios response object, which contains the user data.
// The user data is stored in the 'user' variable.

// The function returns JSX that renders a 'UserInfo' component, passing the user data as a prop.

export default async function Home() {
  // Get the "access-token" cookie from the request headers.
  const c = cookies();
  const token = c.get("access-token")?.value;

  // Call the 'getUser' function, passing the token as a parameter.
  const userResponse = await getUser(token || "");

  // Store the user data from the response in the 'user' variable.
  const user = userResponse?.data.user;

  // Return JSX that renders a 'UserInfo' component, passing the user data as a prop.
  return (
    <div className="">
      {/* Render the 'UserInfo' component, passing the user data as a prop. */}
      <UserInfo userInfo={user} />
    </div>
  );
}
