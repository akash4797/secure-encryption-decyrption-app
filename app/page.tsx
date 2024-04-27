import axios from "axios";
import { cookies } from "next/headers";
import UserInfo from "./UserInfo";
import Userlogout from "./Userlogout";

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
    <div className="h-screen flex flex-col justify-center items-center gap-2">
      <div className="text-2xl pb-2 flex gap-2">
        Welcome
        <span className="">{user.username}</span>
      </div>

      <UserInfo userInfo={user} />
      <Userlogout />
    </div>
  );
}
