"use client";
import React from "react";
import { useFormik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AiFillCheckCircle } from "react-icons/ai";
import axios from "axios";

export default function Login() {
  const params = useSearchParams();
  const isRegister = params.get("register");
  const router = useRouter();

  const loginFormik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        const { username, password } = values;
        const response = await axios.post(
          "/api/login",
          {
            username,
            password,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        if (response.status === 200) {
          router.push("/");
        } else {
          console.error("Login failed:", response.data.message);
        }
      } catch (error) {
        console.error("Error logging in :", error);
      }
    },
  });

  return (
    <div className="h-screen flex flex-col justify-center items-center container mx-auto gap-3 w-96">
      {isRegister === "1" && (
        <div className="absolute top-5 right-5">
          <Alert>
            <AiFillCheckCircle className="h-5 w-5" color="green" />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>
              Registration complete. Please Login to your account
            </AlertDescription>
          </Alert>
        </div>
      )}
      <h1 className="font-semibold text-xl mb-5">Login to the Application</h1>
      <Input
        type="text"
        name="username"
        id="username"
        placeholder="username"
        value={loginFormik.values.username}
        onChange={loginFormik.handleChange}
      />
      <Input
        type="password"
        name="password"
        id="password"
        placeholder="password"
        value={loginFormik.values.password}
        onChange={loginFormik.handleChange}
      />
      <Button
        variant={"default"}
        className="w-full"
        type="button"
        onClick={() => loginFormik.submitForm()}
      >
        Login
      </Button>
    </div>
  );
}
