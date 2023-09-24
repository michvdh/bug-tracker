"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input, InputProps } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Eye } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { useState } from "react";
import Link from "next/link";

const Signup = () => {
  const [emailExists, setEmailExists] = useState(false);
  const [email, setEmail] = useState("");

  const pwRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/;

  const emailRegex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;

  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Invalid email address",
    }),
    password: z
      .string()
      .regex(pwRegex, {
        message:
          "Your password must include at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special symbol.",
      })
      .min(6, {
        message: "Password must be at least 6 characters.",
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // const form = useForm({
  //   defaultValues: {
  //     name: "",
  //     email: "",
  //     password: "",
  //   },
  // });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    const res = await axios.post(
      "http://localhost:5000/api/users/signup",
      values
    );
    console.log(res);

    res.data.emailExists ? setEmailExists(true) : setEmailExists(false);
  };

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e);

    if (emailExists) {
      setEmailExists(false);
    }
    setEmail(e.target.value);
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-blue-100">
      <div className="w-10/12 sm:w-7/12 lg:w-[500px] py-10 px-14 border rounded-md bg-white flex flex-col justify-center gap-10 drop-shadow-md items-center">
        <div className="flex justify-center flex-col items-center gap-3">
          <Image src="/images/ladybug.png" width={50} height={50} alt="logo" />
          <div>
            <h1 className="text-center font-bold text-xl text-faded-purple">
              Sign up
            </h1>
            <span className="text-faded-purple text-sm">
              Let&apos;s get started with your account
            </span>
          </div>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 flex flex-col w-full"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Name" type="text" {...field}></Input>
                  </FormControl>
                  <FormMessage className="bg-red-50 p-2" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      type="text"
                      {...field}
                      value={field.value ?? email}
                      onChange={(event) => {
                        onChangeHandler(event);
                        field.onChange(event);
                      }}
                    ></Input>
                  </FormControl>
                  {emailExists ? (
                    <span className="text-[0.8rem] font-medium text-destructive bg-red-50 p-2 flex">
                      Email already in use
                    </span>
                  ) : (
                    <FormMessage className="bg-red-50 p-2" />
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Password"
                      type="password"
                      {...field}
                    ></Input>
                  </FormControl>
                  <FormMessage className="bg-red-50 p-2" />
                </FormItem>
              )}
            />
            <Button type="submit">Sign up</Button>
          </form>
        </Form>
        <span className="text-sm">
          Already have an account?{" "}
          <Link href={"/login"} className="text-blue-800">
            Login
          </Link>
        </span>
      </div>
    </main>
  );
};

export default Signup;
