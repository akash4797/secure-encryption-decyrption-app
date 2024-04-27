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

/* 
  This component is used to display and update user information.

  Props:
  - userInfo: an object containing user information such as username, email, phone and location.

  State: None

  This component renders a form with input fields for email, phone and location.
  It also renders a notice about data encryption and a logout button.

  Event handlers:
  - handleLogout: removes the access token from cookies and navigates to the login page.

  Functionality:
  - The form is submitted using Formik and the submitted data is sent to the server using axios for updating user information.
  - If the server response status is 200, a success toast is shown. Otherwise, an error toast is shown.

*/
export default function UserInfo({ userInfo }: { userInfo: any }) {
  // Initialize toast and router
  const { toast } = useToast();
  const cookies = new Cookies();
  const router = useRouter();

  // Handle logout
  const handleLogout = () => {
    // Remove access token from cookies
    cookies.remove("access-token");
    // Navigate to login page
    router.push("/login");
  };

  // Initialize formik with initial values and a schema for validation
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
        // Send POST request to /api/updateuser with user data and access token
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

        // Show success toast if response status is 200, else show error toast
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
        // Log any errors to the console
        console.log(e);
      }
    },
  });

  // Render the form with input fields, notice, save button and logout button
  return (
    <div className="h-screen bg-blue-900">
      <div className="flex flex-col justify-center items-center container mx-auto w-96 gap-3 h-full text-white">
        <form
          className="w-full flex flex-col gap-3"
          onSubmit={userFormik.handleSubmit}
        >
          {/* Display user's username */}
          <div className="text-2xl pb-2 flex gap-2">
            Welcome
            <span className="">{userInfo.username}</span>
          </div>

          {/* Input field for email */}
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
              className="text-black"
            />
          </div>

          {/* Input field for phone */}
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
              className="text-black"
            />
          </div>

          {/* Input field for location */}
          <div className="flex flex-col w-full">
            <label
              htmlFor="location"
              className="mb-2 block text-sm font-medium"
            >
              Location
            </label>
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
          <Button type="submit" disabled={userFormik.isSubmitting}>
            Save
          </Button>
        </form>
        {/* Button to logout */}
        <Button
          onClick={handleLogout}
          className="w-full"
          variant={"destructive"}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
