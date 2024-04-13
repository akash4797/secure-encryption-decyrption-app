"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import Cookies from "universal-cookie";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { Input } from "@/components/ui/input";
import * as yup from "yup";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FcDataEncryption } from "react-icons/fc";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

export default function UserInfo({ userInfo }: { userInfo: any }) {
  const { toast } = useToast();
  const cookies = new Cookies();
  const router = useRouter();

  const handleLogout = () => {
    cookies.remove("access-token");
    router.push("/login");
  };

  const userFormik = useFormik({
    initialValues: {
      username: userInfo.username,
      email: userInfo.email,
      phone: userInfo.phone,
      location: userInfo.location,
    },
    validationSchema: yup.object().shape({
      email: yup.string().required("No email provided.").email("Invalid email"),
      phone: yup.string().required("No phone number provided."),
      location: yup.string().required("No location provided."),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios("/api/updateuser", {
          method: "POST",
          data: {
            username: values.username,
            email: values.email,
            phone: values.phone,
            location: values.location,
          },
          headers: {
            Authorization: cookies.get("access-token"),
          },
        });

        if (response.status === 200) {
          toast({
            title: "Success",
            description: "Your profile has been updated successfully",
          });
        } else {
          toast({
            title: "Error",
            description: "Something went wrong",
            variant: "destructive",
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
  });

  return (
    <div className="h-screen flex flex-col justify-center items-center container mx-auto w-96 gap-3">
      <form
        className="w-full flex flex-col gap-3"
        onSubmit={userFormik.handleSubmit}
      >
        <div className="text-2xl border-b border-black pb-2 flex gap-2">
          Hello
          <span className="italic">@{userInfo.username}</span>
        </div>

        <div className="absolute top-5 right-5">
          <Alert className="">
            <FcDataEncryption className="h-5 w-5" />
            <AlertTitle>Notice!</AlertTitle>
            <AlertDescription>
              All your details showing below are encrytped in the database.
            </AlertDescription>
          </Alert>
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <Input
            type="text"
            name="email"
            id="email"
            placeholder="Email"
            value={userFormik.values.email}
            onChange={userFormik.handleChange}
          />
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="phone" className="mb-2 block text-sm font-medium">
            Phone
          </label>
          <Input
            type="text"
            name="phone"
            id="phone"
            placeholder="Phone"
            value={userFormik.values.phone}
            onChange={userFormik.handleChange}
          />
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="location" className="mb-2 block text-sm font-medium">
            Location
          </label>
          <Input
            type="text"
            name="location"
            id="location"
            placeholder="Location"
            value={userFormik.values.location}
            onChange={userFormik.handleChange}
          />
        </div>
        <Button type="submit" disabled={userFormik.isSubmitting}>
          Save
        </Button>
      </form>
      <Button onClick={handleLogout} className="w-full" variant={"destructive"}>
        Logout
      </Button>
    </div>
  );
}
