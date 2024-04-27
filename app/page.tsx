import axios from "axios";
import { cookies } from "next/headers";
import UserInfo from "./UserInfo";

export const getUser = async (token: string) => {
  try {
    return await axios.get("http://localhost:3000/api/userinfo", {
      headers: { Authorization: token },
    });
  } catch {
    return null;
  }
};

export default async function Home() {
  const c = cookies();
  const token = c.get("access-token")?.value;
  const userResponse = await getUser(token || "");
  const user = userResponse?.data.user;
  return (
    <div>
      <UserInfo userInfo={user} />
    </div>
  );
}
