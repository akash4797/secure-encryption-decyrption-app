"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AiFillCheckCircle } from "react-icons/ai";
import { useFormik } from "formik";
import * as yup from "yup";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";

export default function Login() {
  const params = useSearchParams();
  const isRegister = params.get("register");
  const router = useRouter();
  const { toast } = useToast();
  const loginFormik = useFormik({
    initialValues: {
      username: "",
      email: "",
      phone: "",
      location: "",
      password: "",
    },
    validationSchema: yup.object().shape({
      username: yup.string().required("Username is required"),
      password: yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      const { username, password } = values;
      try {
        const response = await axios.post(
          "/api/login",
          { username, password },
          { headers: { "Content-Type": "application/json" } }
        );
        if (response.status === 200) router.push("/");
        else
          toast({
            title: "Authentication Failed",
            description: response.data.message,
            variant: "destructive",
          });
      } catch (error) {
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    },
  });

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
      <form
        className="w-full max-w-lg p-12 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 text-white shadow-2xl rounded-xl"
        onSubmit={loginFormik.handleSubmit}
        style={{ boxShadow: "0 15px 35px rgba(0, 0, 0, 0.25)" }}
      >
        {isRegister === "1" && (
          <div className="absolute top-3 right-3">
            <Alert className="bg-purple-200 text-purple-800 border border-purple-300 rounded p-2">
              <AiFillCheckCircle className="h-5 w-5" />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>
                Registration complete. Please login to your account.
              </AlertDescription>
            </Alert>
          </div>
        )}
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <Input
          type="text"
          name="username"
          id="username"
          placeholder="Username"
          value={loginFormik.values.username}
          onChange={loginFormik.handleChange}
          className="w-full p-4 mb-4 bg-white text-gray-700 rounded"
        />
        <Input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          value={loginFormik.values.password}
          onChange={loginFormik.handleChange}
          className="w-full p-4 mb-4 bg-white text-gray-700 rounded"
        />
        <Button
          className="w-full p-4 bg-green-500 rounded hover:bg-green-600"
          type="submit"
          disabled={loginFormik.isSubmitting}
        >
          Login
        </Button>
        <Link href="/register" className="w-full">
          <Button className="w-full mt-4 p-4 border border-green-500 text-green-500 rounded hover:bg-green-100">
            Register
          </Button>
        </Link>
      </form>
    </div>
  );
}
