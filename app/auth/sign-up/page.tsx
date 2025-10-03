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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SignUpUser } from "@/lib/actions/auth";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SignUp = () => {
  const [email, setemail] = useState<string>("");
  const [password, setpassword] = useState<string>("");
  const [isloading, setisloading] = useState<boolean>(false);
  const [name, setname] = useState<string>("");
  const [role, setrole] = useState("");
  const router = useRouter();
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setisloading(true);
    if (!role) {
      toast.error("Please select a role!");
      setisloading(false);
      return;
    }
    try {
      const result = await SignUpUser(email, password, name, role);
      if (!result.user) {
        toast.error("Failed to create an account!");
        console.log("Failed to create an account");
        return;
      }
      toast.success("Created an account!");
      router.push("/");
    } catch (error) {
      toast.error("Something went wrong!");
      console.error("error in signup:", error);
    }
    setemail("");
    setpassword("");
    setname("");
    setrole("");
    setisloading(false);
  }
  return (
    <div className="relative z-99 flex justify-center items-center h-[70vh] w-full">
      <Card className="w-full max-w-sm backdrop-blur-xl  bg-white/10 border border-white/20 shadow-2xl rounded-2xl relative z-10">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-semibold text-black">
            Welcome To Skill Swap!
          </CardTitle>
          <CardDescription className="text-black">
            Create your account!
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
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="Name" className="text-black">
                  Name
                </Label>
              </div>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setname(e.target.value)}
                placeholder="Enter your Name.."
                required
                className="bg-white/20 border-black/50 text-black placeholder:text-gray-400"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="Name" className="text-black">
                  Choose your role
                </Label>
              </div>
              <Select
                value={role}
                onValueChange={(value) => setrole(value)}
                required
              >
                <SelectTrigger className="w-full bg-white/20 border-black/50 text-black placeholder:text-gray-400">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="border-0 bg-white">
                  <SelectGroup className="bg-white rounded-lg">
                    <SelectLabel>Role</SelectLabel>
                    <SelectItem value="Student">Student</SelectItem>
                    <SelectItem value="Teacher">Teacher</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              disabled={isloading ? true : false}
              className="w-full text-white bg-black hover:bg-black/50  disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isloading ? <p>Signing up...</p> : <p>Sign Up</p>}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <p className="text-sm font-light cursor-pointer text-black mt-2">
            Already have an account?{" "}
            <a
              onClick={() => router.push("/auth/sign-in")}
              className="text-black cursor-pointer hover:underline"
            >
              SignIn
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;
