"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import Cookies from "universal-cookie";
import { useRouter } from "next/navigation";

export default function UserInfo({ userInfo }: { userInfo: any }) {
  const cookies = new Cookies();
  const router = useRouter();

  const handleLogout = () => {
    cookies.remove("access-token");
    router.push("/login");
  };

  return (
    <div>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
}
