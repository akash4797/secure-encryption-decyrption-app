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

/*
 * The Login component is a functional component that serves as the login page
 * for the application. It uses several hooks from the "next/navigation"
 * module to get query parameters and the router object. It also uses the
 * useFormik hook from the "formik" module to handle the form submission
 * and validation.
 *
 * The component renders a form with two input fields for the username and
 * password, and a button to submit the form. It also renders a success
 * message if the user has just registered. The success message is
 * displayed using the Alert component from the "@/components/ui/alert"
 * module.
 *
 * The form is handled by the useFormik hook. The initial values of the
 * form are an empty string for the username and password. When the form
 * is submitted, the onSubmit function is called. This function sends a
 * POST request to the "/api/login" endpoint with the username and password
 * in the request body. If the response status is 200, the router is used
 * to navigate to the home page. Otherwise, an error message is logged to
 * the console.
 *
 * The component returns a div that contains the form and the success
 * message. The form is rendered using the Input component from the
 * "@/components/ui/input" module for the username and password fields, and
 * the Button component from the "@/components/ui/button" module for the
 * submit button. The success message is rendered using the Alert component.
 * The Link component from the "next/link" module is used to create a link
 * to the registration page.
 */
export default function Login() {
  // Get the query parameters and the router object
  // These hooks are from the "next/navigation" module
  const params = useSearchParams(); // Gets the query parameters
  const isRegister = params.get("register"); // Gets the value of the "register" parameter
  const router = useRouter(); // Gets the router object

  // Handle the form submission and validation
  // This hook is from the "formik" module
  const loginFormik = useFormik({
    initialValues: {
      username: "", // Initial value of the username field
      password: "", // Initial value of the password field
    },
    validationSchema: yup.object().shape({
      username: yup.string().required("Username is required"), // Validation schema for the username
      password: yup.string().required("Password is required"), // Validation schema for the password
    }),
    onSubmit: async (values) => {
      try {
        // Extract the username and password from the form values
        const { username, password } = values;

        // Send a POST request to the "/api/login" endpoint
        // with the username and password in the request body
        const response = await axios.post(
          "/api/login",
          {
            username, // Send the username
            password, // Send the password
          },
          {
            headers: { "Content-Type": "application/json" }, // Set the request headers
          }
        );

        // If the response status is 200, navigate to the home page
        if (response.status === 200) {
          router.push("/"); // Navigate to the home page
        } else {
          // Log an error message if the login fails
          console.error("Login failed:", response.data.message);
        }
      } catch (error) {
        // Log an error message if there is an error during the login process
        console.error("Error logging in:", error);
      }
    },
  });

  // Render the login page
  return (
    <form
      className="h-screen flex flex-col justify-center items-center container mx-auto gap-3 w-96"
      onSubmit={loginFormik.handleSubmit} // Handle the form submission
    >
      {/* Render a success message if the user has just registered */}
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
      {/* Render the form */}
      <h1 className="font-semibold text-xl mb-5">Login to the Application</h1>
      <Input
        type="text"
        name="username"
        id="username"
        placeholder="username"
        value={loginFormik.values.username} // Get the value of the username field
        onChange={loginFormik.handleChange} // Handle the change of the username field
      />
      <Input
        type="password"
        name="password"
        id="password"
        placeholder="password"
        value={loginFormik.values.password} // Get the value of the password field
        onChange={loginFormik.handleChange} // Handle the change of the password field
      />
      <Button
        variant={"default"}
        className="w-full"
        type="submit"
        disabled={loginFormik.isSubmitting} // Disable the button while the form is submitting
      >
        Login
      </Button>
      {/* Render a link to the registration page */}
      <Link href={"/register"} className="w-full">
        <Button className="w-full" variant={"outline"}>
          Register
        </Button>
      </Link>
    </form>
  );
}
