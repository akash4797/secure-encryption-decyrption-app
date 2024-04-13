"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import Cookies from "universal-cookie";
import { useRouter } from "next/navigation";

export default function UserInfo({ userinfo }: { userinfo: any }) {
  const cookies = new Cookies();
  const router = useRouter();
  const loguthandler = () => {
    cookies.remove("access-token");
    router.push("/login");
  };
  return (
    <div>
      <Button onClick={loguthandler}>Logout</Button>
    </div>
  );
}
