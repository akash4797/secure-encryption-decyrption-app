"use client";
import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";

// This is a React functional component for the Register page.
// It uses useFormik hook from formik library to handle form validation and submission.
// It renders a form with three inputs for username, password, and confirm password.
// On form submit, it sends a POST request to the "/api/register" endpoint with the form data.
// After a successful registration, it redirects the user to the Login page.
// If there is an error during registration, it logs the error.

export default function Register() {
  // We get the router object from the next/navigation library.
  // This object allows us to navigate programmatically within our application.
  const router = useRouter();

  // We get the toast function from the useToast hook from the ui library.
  const { toast } = useToast();

  // We initialize formik with initial values for the form inputs and a validation schema.
  // The schema ensures that the username is required and the password is at least 8 characters long and contains Latin letters.
  // The confirm password field is also required and must match the password.
  const registerFormik = useFormik({
    initialValues: {
      username: "",
      password: "",
      confirmpassword: "",
    },
    validationSchema: yup.object().shape({
      username: yup.string().required("No username provided."), // Ensure the username is required
      password: yup
        .string()
        .required("No password provided.") // Ensure the password is required
        .min(8, "Password is too short - should be 8 chars minimum.")
        .matches(/[a-zA-Z]/, "Password can only contain Latin letters."), // Ensure the password is at least 8 characters long and contains Latin letters
      confirmpassword: yup
        .string()
        .required("Please retype password again")
        .oneOf([yup.ref("password")], "Passwords must match"), // Ensure the confirm password field is required and must match the password
    }),
    // On form submit, we send a POST request to the "/api/register" endpoint.
    // If the response status is 200, we log a success message.
    // Otherwise, we log an error message.
    // Finally, we redirect the user to the Login page.
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
          router.push("/login?register=1");
        } else {
          console.error("Registration failed:", response.data.message);
          toast({
            title: "Registration Failed",
            description: response.data.message,
            variant: "destructive",
          }); // toast error
        }
      } catch (error) {
        console.error("Error registering user:", error);
        toast({
          title: "Registration Failed",
          description: "An error occurred while registering the user.",
          variant: "destructive",
        }); // toast error
      }
    },
  });

  // We render the form with three input fields for username, password, and confirm password.
  // We also render a submit button and a link to the Login page.
  return (
    <form
      onSubmit={registerFormik.handleSubmit} // Handle form submission
      className="h-screen flex flex-col justify-center items-center container mx-auto gap-3 w-96"
    >
      <h1 className="font-semibold text-xl mb-5">
        Register to the Application
      </h1>
      <div className="flex flex-col w-full">
        <span className="text-sm">
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
        <span className="text-sm">
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
        <span className="text-sm">
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
        disabled={registerFormik.isSubmitting} // Disable the button while the form is submitting
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
