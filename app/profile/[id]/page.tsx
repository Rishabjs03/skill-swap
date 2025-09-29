"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GetMyProfile } from "@/lib/actions/profile";

import { ArrowLeft, Calendar, Edit3 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Skills {
  ownerId: string;
  title: string;
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

  const router = useRouter();

  useEffect(() => {
    async function loadProfile() {
      const user = await GetMyProfile();
      if (!user) {
        throw new Error("failed to load profile");
      }
      setuser(user);
    }
    loadProfile();
  }, []);
  return (
    <div className="min-h-[80vh] w-full flex justify-center items-center px-6">
      <div className="w-full max-w-7xl py-10">
        {/* Back button */}
        <Button
          variant="ghost"
          className="mb-6 text-gray-700 hover:text-black"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to home
        </Button>

        {/* Grid Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Side Profile Card */}
          <div className="lg:col-span-1">
            <Card className="relative overflow-hidden border border-white/30 backdrop-blur-xl bg-white/10 shadow-2xl">
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
                    {new Date(user?.createdAt ?? Date.now()).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        year: "numeric",
                      }
                    )}
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
              className="w-full border py-2 px-2 border-white/30 rounded-xl backdrop-blur-xl bg-white/10 shadow-xl"
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
              <TabsContent
                value="skills"
                className="space-y-6 p-6 text-gray-800"
              >
                <p>No skills added yet.</p>
              </TabsContent>
              <TabsContent
                value="reviews"
                className="space-y-6 p-6 text-gray-800"
              >
                <p>No reviews yet.</p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
