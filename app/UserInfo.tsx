"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import Cookies from "universal-cookie";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { Input } from "@/components/ui/input";
import * as yup from "yup";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UserInfo({ userInfo }: { userInfo: any }) {
  const { toast } = useToast();
  const cookies = new Cookies();
  const router = useRouter();

  const handleLogout = () => {
    cookies.remove("access-token");
    router.push("/signin");
  };

  const userFormik = useFormik({
    initialValues: {
      username: userInfo.username,
      email: userInfo.email,
      phone: userInfo.phone,
      location: userInfo.location,
      bio: userInfo.bio,
      post: userInfo.post,
      gender: userInfo.gender,
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
            bio: values.bio,
            post: values.post,
            gender: values.gender,
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
    <div className="h-screen bg-blue-900">
      <div className="flex flex-col justify-center items-center container mx-auto w-96 gap-3 h-full text-white">
        <form
          className="w-full flex flex-col gap-3"
          onSubmit={userFormik.handleSubmit}
        >
          <div className="text-2xl pb-2 flex gap-2">
            Welcome
            <span className="">{userInfo.username}</span>
          </div>

          <div className="flex flex-col w-full">
            <label htmlFor="email" className="mb-2 block text-sm font-medium" />
            <Input
              type="text"
              name="email"
              id="email"
              placeholder="Email"
              value={userFormik.values.email}
              onChange={userFormik.handleChange}
              className="text-black"
            />
          </div>

          <div className="flex flex-col w-full">
            <label htmlFor="phone" className="mb-2 block text-sm font-medium" />
            <Input
              type="text"
              name="phone"
              id="phone"
              placeholder="Phone"
              value={userFormik.values.phone}
              onChange={userFormik.handleChange}
              className="text-black"
            />
          </div>

          <div className="flex flex-col w-full">
            <label
              htmlFor="location"
              className="mb-2 block text-sm font-medium"
            />
            <Input
              type="text"
              name="location"
              id="location"
              placeholder="Location"
              value={userFormik.values.location}
              onChange={userFormik.handleChange}
              className="text-black"
            />
          </div>

          <div className="flex flex-col w-full text-black">
            <label
              htmlFor="gender"
              className="mb-2 block text-sm font-medium"
            />
            <Select
              onValueChange={(e) => userFormik.setFieldValue("gender", e)}
              value={userFormik.values.gender}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={userFormik.values.gender} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col w-full">
            <label htmlFor="bio" className="mb-2 block text-sm font-medium" />
            <Input
              type="text"
              name="bio"
              id="bio"
              placeholder="Bio"
              value={userFormik.values.bio}
              onChange={userFormik.handleChange}
              className="text-black"
            />
          </div>

          <div className="flex flex-col w-full">
            <label htmlFor="post" className="mb-2 block text-sm font-medium" />
            <Textarea
              name="post"
              id="post"
              placeholder="Post"
              value={userFormik.values.post}
              onChange={userFormik.handleChange}
              className="text-black"
            />
          </div>
          <Button type="submit" disabled={userFormik.isSubmitting}>
            Change
          </Button>
        </form>
        <Button
          onClick={handleLogout}
          className="w-full"
          variant={"destructive"}
          value={"Logout"}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
