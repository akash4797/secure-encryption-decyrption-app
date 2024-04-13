import axios from "axios";
import { cookies } from "next/headers";
import UserInfo from "./UserInfo";

export const getUser = async (token: string) => {
  try {
    const response = await axios.get("http://localhost:3000/api/userinfo", {
      headers: {
        Authorization: token,
      },
    });
    return response;
  } catch (error) {
    return null;
  }
};

export default async function Home() {
  const c = cookies();
  const token = c.get("access-token")?.value;
  const userResponse = await getUser(token || "");
  const user = userResponse?.data.user;
  return (
    <div className="">
      <h1>Hello {user.username}</h1>
      <div className="">Welcome home</div>
      <UserInfo userinfo={user} />
    </div>
  );
}
