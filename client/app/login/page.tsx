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
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

const Login = () => {
  const [errorFree, setErrorFree] = useState(true);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (submitted && errorFree && !isLoading) {
      setSubmitted(false);
      router.push("/");
    }

    if (submitted && !errorFree) {
      setSubmitted(false);
    }
  }, [submitted, errorFree, isLoading]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (loginSuccess) return;

    setSubmitted(true);
    setIsLoading(true);

    const loginResult = await axios.post(
      "http://localhost:5000/api/users/login",
      values
    );

    console.log(loginResult);
    if (loginResult.status === 200) {
      setIsLoading(false);
    }

    if (loginResult.data.success) {
      setLoginSuccess(true);
    }

    setErrorFree(loginResult.data.success);
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-blue-100">
      <div className="w-10/12 sm:w-7/12 lg:w-[500px] py-10 px-14 border rounded-md bg-white flex flex-col justify-center gap-10 drop-shadow-md items-center">
        <div className="flex justify-center flex-col items-center gap-3">
          <Image src="/images/ladybug.png" width={50} height={50} alt="logo" />
          <div>
            <h1 className="text-center font-bold text-xl text-faded-purple">
              Welcome
            </h1>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 flex flex-col w-full"
          >
            {!errorFree && (
              <span className="flex p-3 bg-red-50 text-destructive font-medium text-[0.8rem] w-full">
                Incorrect Email or Password
              </span>
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Email" type="email" {...field}></Input>
                  </FormControl>
                  <FormMessage className="bg-red-50 p-3" />
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
                  <FormMessage className="bg-red-50 p-3" />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Logging in" : "Log in"}
            </Button>
          </form>
        </Form>
        <span className="text-sm">
          Don&apos;t have an account yet?{" "}
          <Link href="/signup" className="text-blue-800">
            Sign up
          </Link>
        </span>
      </div>
    </main>
  );
};

export default Login;
