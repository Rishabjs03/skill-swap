"use client";

import SkillCard from "@/app/components/SkillCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GetMyProfile } from "@/lib/actions/profile";
import { GetSessionUser } from "@/lib/actions/session";

import { ArrowLeft, Calendar, Edit3 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
interface Skills {
  id: string;
  title: string;
  description: string;
  category: string | null;
  rate: number;
  ownerId: string;
  createdAt: Date;
  owner: {
    id: string;
    name: string | null;
    image: string | null;
  };
}
interface UserProps {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  bio: string | null;
  createdAt: Date;
  skills: Skills[];
}

const ProfilePage = () => {
  const [user, setuser] = useState<UserProps | null>(null);
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [isloading, setisloading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    async function loadProfile() {
      const user = await GetMyProfile();
      const sessionUser = await GetSessionUser();
      if (!user) {
        throw new Error("failed to load profile");
      }
      setuser(user);
      setSessionUserId(sessionUser?.id || null);
      setisloading(false);
    }
    loadProfile();
  }, []);
  return (
    <div className="min-h-[80vh] w-full flex justify-center items-center px-6">
      <div className="w-full max-w-7xl py-10">
        {/* Back button */}
        <Button
          variant="ghost"
          className="mb-6 text-gray-700 hover:text-white hover:bg-black transition-all"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to home
        </Button>

        {/* Grid Layout */}
        {isloading ? (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Side Profile Card Skeleton */}
            <div className="lg:col-span-1">
              <Card className="relative overflow-hidden border border-white/30 backdrop-blur-xl bg-white/10 shadow-2xl">
                <CardHeader className="relative pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-20 w-20 rounded-full bg-gray-300" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32 bg-gray-300" />
                        <Skeleton className="h-3 w-48 bg-gray-300" />
                        <Skeleton className="h-6 w-20 rounded-full bg-gray-300" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-16 rounded-md bg-gray-300" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Skeleton className="h-4 w-20 mb-2 bg-gray-300" />
                    <Skeleton className="h-3 w-full bg-gray-300" />
                    <Skeleton className="h-3 w-2/3 mt-1 bg-gray-300" />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4 rounded-full bg-gray-300" />
                    <Skeleton className="h-3 w-32 bg-gray-300" />
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-300">
                    <div className="space-y-2 text-center">
                      <Skeleton className="h-6 w-10 mx-auto bg-gray-300" />
                      <Skeleton className="h-3 w-12 mx-auto" />
                    </div>
                    <div className="space-y-2 text-center">
                      <Skeleton className="h-6 w-10 mx-auto bg-gray-300" />
                      <Skeleton className="h-3 w-12 mx-auto bg-gray-300" />
                    </div>
                    <div className="space-y-2 text-center">
                      <Skeleton className="h-6 w-10 mx-auto bg-gray-300" />
                      <Skeleton className="h-3 w-12 mx-auto bg-gray-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Side Tabs Skeleton */}
            <div className="lg:col-span-2">
              <Card className="w-full border py-2 px-2 border-white/30 rounded-xl backdrop-blur-xl bg-white/10 shadow-xl">
                <CardHeader>
                  <Skeleton className="h-8 w-24 mb-4 bg-gray-300" />
                  <div className="flex gap-4">
                    <Skeleton className="h-6 w-20 bg-gray-300" />
                    <Skeleton className="h-6 w-20 bg-gray-300" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-3 w-full bg-gray-300" />
                  <Skeleton className="h-3 w-5/6 bg-gray-300" />
                  <Skeleton className="h-3 w-2/3 bg-gray-300" />
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Side Profile Card */}
            <div className="lg:col-span-1">
              <Card className="relative overflow-hidden border border-white/30 backdrop-blur-xl bg-white/10 shadow-2xl hover:scale-105 transition-all ">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-300 to-white opacity-20" />
                <CardHeader className="relative pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-20 w-20 ring-2 ring-white/40 shadow-xl">
                        <AvatarImage
                          src={user?.image || "/default.jpg"}
                          alt="user"
                        />
                        <AvatarFallback className="text-lg font-semibold">
                          U
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <h2 className="text-xl font-semibold text-gray-900">
                          {user?.name}
                        </h2>
                        <p className="text-sm text-gray-600">{user?.email}</p>
                        <div className="flex flex-wrap gap-2 pt-2">
                          <Badge
                            variant="outline"
                            className="border-gray-400  rounded-full text-gray-700"
                          >
                            <span className="font-semibold py-1 px-1">
                              {user?.skills.length || 0} Skills
                            </span>
                          </Badge>
                        </div>
                      </div>
                    </div>
                    {user && sessionUserId === user.id && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-bl-xl rounded-tl-xl border border-white/40 bg-white
             text-gray-800  hover:text-black
             shadow-md transition"
                        onClick={() => router.push("/profile/edit")}
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="relative space-y-4">
                  <div>
                    <h3 className="font-semibold mb-1 text-gray-900">About</h3>
                    <p className="text-sm leading-relaxed text-gray-700">
                      {user?.bio || "No bio listed"}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Member since{" "}
                      {new Date(
                        user?.createdAt ?? Date.now()
                      ).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-300">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {user?.skills.length}
                      </div>
                      <div className="text-xs text-gray-600">Skills</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-pink-600">0</div>
                      <div className="text-xs text-gray-600">Reviews</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">0</div>
                      <div className="text-xs text-gray-600">Rating</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Side Tabs */}
            <div className="lg:col-span-2">
              <Tabs
                defaultValue="skills"
                className="w-full  py-2 px-2 border-2 border-gray-200 rounded-xl  bg-white/10 shadow-xl  "
              >
                <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                  <TabsTrigger
                    value="skills"
                    className="data-[state=active]:bg-white"
                  >
                    Skills
                  </TabsTrigger>
                  <TabsTrigger
                    value="reviews"
                    className="data-[state=active]:bg-white"
                  >
                    Reviews
                  </TabsTrigger>
                </TabsList>

                <ScrollArea className="w-full h-[500px] border-0 rounded-lg relative whitespace-nowrap">
                  <TabsContent
                    value="skills"
                    className="space-y-6 p-6 text-gray-800"
                  >
                    {user?.skills && user?.skills.length > 0 ? (
                      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-1 ">
                        {user.skills.map((skill) => (
                          <SkillCard key={skill.id} skill={skill} />
                        ))}
                      </div>
                    ) : (
                      <p className="absolute top-50 left-30 md:top-50 md:left-90 ">
                        No skills added yet.
                      </p>
                    )}
                  </TabsContent>
                  <TabsContent
                    value="reviews"
                    className="space-y-6 p-6 text-gray-800 relative"
                  >
                    <p className="absolute top-50 left-30 md:top-50 md:left-90 ">
                      No reviews yet.
                    </p>
                  </TabsContent>
                  <ScrollBar orientation="vertical" />
                </ScrollArea>
              </Tabs>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
