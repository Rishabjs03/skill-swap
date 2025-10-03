"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GetMyProfile, UpdateProfileAction } from "@/lib/actions/profile";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";

const EditPage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await GetMyProfile(); // backend se current user fetch
        if (!user) return;

        setName(user.name || "");
        setEmail(user.email || "");
        setBio(user.bio || "");
        setAvatarPreview(user.image || null);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }

    fetchUser();
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("bio", bio);
    if (avatar) formData.append("avatar", avatar);

    try {
      const result = await UpdateProfileAction(formData);
      if (!result) {
        throw new Error("failed to edit the changes");
      }
      setName("");
      setBio("");
      setEmail("");
      setAvatar(null);
      setAvatarPreview("");
      router.back();
    } catch (error) {
      console.error("error in updating:", error);
    }
  }

  return (
    <div className="min-h-[80vh] w-full flex justify-center items-center px-6">
      <div className="w-full md:w-1/4 max-w-6xl py-10">
        <Button
          variant="ghost"
          className="mb-6 text-gray-700 hover:text-white hover:bg-black transition-all"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Profile
        </Button>

        <div className="grid ">
          <Card className="relative overflow-hidden border border-white/30 backdrop-blur-xl bg-white/10 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-400 to-white opacity-20" />
            <CardHeader className="relative ">
              <div className="flex items-center justify-start flex-col gap-y-2 ">
                <h1 className=" font-medium text-3xl cursor-pointer">
                  Edit Profile
                  <span className="w-full h-0.5 bg-black" />
                </h1>
              </div>
            </CardHeader>
            <CardContent className="flex relative flex-col items-center justify-center ">
              <form onSubmit={handleSubmit} className="w-full space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xl px-1 font-medium">
                    Name
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    className="bg-white rounded-xl shadow-xl border-white/20 text-black"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xl px-1 font-medium">
                    Email
                  </Label>
                  <Input
                    type="text"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="bg-white rounded-xl shadow-xl border-white/20 text-black"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xl px-1 font-medium">
                    Bio
                  </Label>
                  <Input
                    type="textarea"
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Bio"
                    className="bg-white rounded-xl shadow-xl border-white/20 text-black"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="avatar" className="text-xl px-1 font-medium">
                    Avatar
                  </Label>
                  <Input
                    type="file"
                    id="avatar"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="bg-white rounded-xl shadow-xl border-white/20 text-black"
                  />
                  {avatarPreview && (
                    <Image
                      src={avatarPreview}
                      width={96}
                      height={96}
                      alt="Avatar Preview"
                      className="mt-2 w-24 h-24 rounded-full object-cover border shadow-lg"
                    />
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-black text-white rounded-xl shadow-xl"
                >
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditPage;
