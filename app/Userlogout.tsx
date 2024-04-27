"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";
import Cookies from "universal-cookie";

export default function Userlogout() {
  const cookies = new Cookies();
  const router = useRouter();
  const handleLogout = () => {
    cookies.remove("access-token");
    router.push("/signin");
  };
  return (
    <Button variant={"destructive"} className="w-fit" onClick={handleLogout}>
      Logout
    </Button>
  );
}
