"use client";
import React, { useState } from "react";
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
import { SignInUser } from "@/lib/actions/auth";

const SignIn = () => {
  const [email, setemail] = useState<string>("");
  const [password, setpassword] = useState<string>("");
  const [isloading, setisloading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    e.preventDefault();
    setisloading(true);
    try {
      const result = await SignInUser(email, password);
      if (!result.user) {
        console.log("Invalid email or password");
      }
      router.push("/");
    } catch (error) {
      console.error("error in signin:", error);
    }
    setemail("");
    setpassword("");
    setisloading(false);
  };
  return (
    <div className="relative z-10 flex justify-center items-center h-[70vh] w-full">
      <Card className="w-full max-w-sm  backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl relative z-10">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-semibold text-black">
            Welcome Back!
          </CardTitle>
          <CardDescription className="text-black">
            Enter your email and password to continue
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-black">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setemail(e.target.value)}
                placeholder="m@example.com"
                required
                className="bg-white/20 border-black/50 text-black placeholder:text-gray-400"
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-black">
                  Password
                </Label>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                placeholder="Password.."
                required
                className="bg-white/20 border-black/50 text-black placeholder:text-gray-400"
              />
            </div>
            <Button
              type="submit"
              disabled={isloading ? true : false}
              className="w-full text-white bg-black hover:bg-black/50"
            >
              {isloading ? <p>logging in...</p> : <p>Sign In</p>}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
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
