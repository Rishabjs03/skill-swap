"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Background from "@/app/components/Background";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const router = useRouter();
  return (
    <div className="relative flex justify-center items-center h-[70vh] w-full">
      {/* Background */}
      <Background />

      {/* Card */}
      <Card className="w-full max-w-sm backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl relative z-10">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-semibold text-black">
            Welcome Back!
          </CardTitle>
          <CardDescription className="text-black">
            Enter your email and password to continue
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="flex flex-col gap-6">
            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-black">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                className="bg-white/20 border-black/50 text-black placeholder:text-gray-400"
              />
            </div>

            {/* Password */}
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-black">
                  Password
                </Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Password.."
                required
                className="bg-white/20 border-black/50 text-black placeholder:text-gray-400"
              />
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button
            type="submit"
            className="w-full text-white bg-black hover:bg-black/50"
          >
            Sign In
          </Button>
          <p className="text-sm font-light cursor-pointer text-black mt-2">
            Don’t have an account?{" "}
            <a
              onClick={() => router.push("/auth/sign-up")}
              className="text-black cursor-pointer hover:underline"
            >
              Sign up
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignIn;
