"use client";
import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const registerFormik = useFormik({
    initialValues: {
      username: "",
      password: "",
      confirmpassword: "",
    },
    validationSchema: yup.object().shape({
      username: yup.string().required("No username provided."),
      password: yup
        .string()
        .required("No password provided.")
        .min(8, "Password is too short - should be 8 chars minimum.")
        .matches(/[a-zA-Z]/, "Password can only contain Latin letters."),
      confirmpassword: yup
        .string()
        .required("Please retype password again")
        .oneOf([yup.ref("password")], "Passwords must match"),
    }),
    onSubmit: async (values) => {
      try {
        const { username, password } = values;
        const response = await axios.post(
          "/api/register",
          {
            username,
            password,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.status === 200) {
          console.log("Registration successful!");
        } else {
          console.error("Registration failed:", response.data.message);
        }
      } catch (error) {
        console.error("Error registering user:", error);
      } finally {
        router.push("/login?register=1");
      }
    },
  });
  return (
    <form
      onSubmit={registerFormik.handleSubmit}
      className="h-screen flex flex-col justify-center items-center container mx-auto gap-3 w-96"
    >
      <h1 className="font-semibold text-xl mb-5">
        Register to the Application
      </h1>
      <div className="flex flex-col w-full">
        <span>
          {registerFormik.touched.username && registerFormik.errors.username}
        </span>
        <Input
          type="text"
          name="username"
          id="username"
          placeholder="Username"
          value={registerFormik.values.username}
          onChange={registerFormik.handleChange}
        />
      </div>
      <div className="flex flex-col w-full">
        <span>
          {registerFormik.touched.password && registerFormik.errors.password}
        </span>
        <Input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          value={registerFormik.values.password}
          onChange={registerFormik.handleChange}
        />
      </div>
      <div className="flex flex-col w-full">
        <span>
          {registerFormik.touched.password &&
            registerFormik.errors.confirmpassword}
        </span>
        <Input
          type="password"
          name="confirmpassword"
          id="confirmpassword"
          placeholder="Confirm Password"
          value={registerFormik.values.confirmpassword}
          onChange={registerFormik.handleChange}
        />
      </div>
      <Button
        type={"submit"}
        disabled={registerFormik.isSubmitting}
        className="w-full"
      >
        Register
      </Button>
      <Link href={"/login"} className="w-full">
        <Button className="w-full" variant={"outline"}>
          Login
        </Button>
      </Link>
    </form>
  );
}
