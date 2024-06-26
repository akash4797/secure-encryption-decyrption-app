"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AiFillCheckCircle } from "react-icons/ai";
import { useFormik } from "formik";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
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
        console.log(error);
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    },
  });

  return (
    <div className="h-screen grid grid-cols-3">
      <div className="col-span-2">
        <Image
          src={"/back.png"}
          alt="image"
          width={500}
          height={500}
          className="w-full h-full object-cover"
        />
      </div>
      <form
        className="h-full flex flex-col justify-center items-center container mx-auto gap-3 w-96 col-span-1"
        onSubmit={loginFormik.handleSubmit}
      >
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
        <h1 className="font-semibold text-xl mb-5">Login</h1>
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
          type="submit"
          disabled={loginFormik.isSubmitting}
        >
          Login
        </Button>
        <Link href={"/signup"} className="w-full">
          <Button className="w-full" variant={"outline"}>
            Register
          </Button>
        </Link>
      </form>
    </div>
  );
}
