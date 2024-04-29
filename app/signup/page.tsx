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
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Register() {
  const router = useRouter();
  const { toast } = useToast();

  const registerFormik = useFormik({
    initialValues: {
      username: "",
      email: "",
      phone: "",
      location: "",
      password: "",
      confirmpassword: "",
      gender: "MALE",
    },
    validationSchema: yup.object().shape({
      username: yup.string().required("No username provided."),
      email: yup.string().required("No email provided.").email("Invalid email"),
      phone: yup.string().required("No phone number provided."),
      location: yup.string().required("No location provided."),
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
        const { username, password, email, phone, location, gender } = values;

        const response = await axios.post(
          "/api/register",
          {
            username,
            password,
            email,
            phone,
            location,
            gender,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.status === 200) {
          router.push("/signin?register=1");
        } else {
          console.error("Registration failed:", response.data.message);
          toast({
            title: "Registration Failed",
            description: response.data.message,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error registering user:", error);
        toast({
          title: "Registration Failed",
          description: "An error occurred while registering the user.",
          variant: "destructive",
        });
      }
    },
  });

  return (
    <div className="h-screen grid grid-cols-3">
      <div className="col-span-2">
        <Image
          src="/back.png"
          alt="Logo"
          width={1000}
          height={1000}
          className="object-cover w-full h-full"
        />
      </div>
      <form
        onSubmit={registerFormik.handleSubmit}
        className="h-screen flex flex-col justify-center items-center container mx-auto gap-3 w-96"
      >
        <h1 className="font-semibold text-xl mb-5">Sign Up</h1>
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
            {registerFormik.touched.email && registerFormik.errors.email}
          </span>
          <Input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            value={registerFormik.values.email}
            onChange={registerFormik.handleChange}
          />
        </div>
        <div className="flex flex-col w-full">
          <span className="text-sm">
            {registerFormik.touched.phone && registerFormik.errors.phone}
          </span>
          <Input
            type="tel"
            name="phone"
            id="phone"
            placeholder="Phone"
            value={registerFormik.values.phone}
            onChange={registerFormik.handleChange}
          />
        </div>
        <div className="flex flex-col w-full">
          <span className="text-sm">
            {registerFormik.touched.location && registerFormik.errors.location}
          </span>
          <Input
            type="text"
            name="location"
            id="location"
            placeholder="Location"
            value={registerFormik.values.location}
            onChange={registerFormik.handleChange}
          />
        </div>
        <div className="flex flex-col w-full">
          <span className="text-sm">
            {registerFormik.touched.gender && registerFormik.errors.gender}
          </span>
          <Select
            onValueChange={(e) => registerFormik.setFieldValue("gender", e)}
            value={registerFormik.values.gender}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MALE">Male</SelectItem>
              <SelectItem value="FEMALE">Female</SelectItem>
            </SelectContent>
          </Select>
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
          disabled={registerFormik.isSubmitting}
          className="w-full"
        >
          Register
        </Button>
        <Link href={"/signin"} className="w-full">
          <Button className="w-full" variant={"outline"}>
            Login
          </Button>
        </Link>
      </form>
    </div>
  );
}
