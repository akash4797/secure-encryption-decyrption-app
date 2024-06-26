import axios from "axios";
import { cookies } from "next/headers";
import UserInfo from "./UserInfo";
import Userlogout from "./Userlogout";
import { headers } from "next/headers";

const getUser = async (token: string, hostname: string) => {
  try {
    console.log("My host is:", hostname + "/api/userinfo");

    const user = await fetch(hostname + "/api/userinfo", {
      headers: { Authorization: token },
    });
    return user;
  } catch {
    return null;
  }
};

export default async function Home() {
  const headerlist = headers();
  const isDev = process.env.NODE_ENV !== "production";
  const hostname = isDev
    ? "http://localhost:3000"
    : "https://".concat(headerlist.get("x-forwarded-host") || "");
  const c = cookies();
  const token = c.get("access-token")?.value;
  const userResponse = await getUser(token || "", hostname);
  const data = await userResponse?.json();

  const user = data?.user;

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
