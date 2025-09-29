"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UpdateProfileAction } from "@/lib/actions/profile";
import { ArrowLeft, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import React, { useState } from "react";
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

const EditPage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [skill, setSkill] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const addSkill = () => {
    if (skill.trim() && !skills.includes(skill)) {
      setSkills([...skills, skill]);
      setSkill("");
    }
  };
  const removeSkill = (s: string) => {
    setSkills(skills.filter((item) => item !== s));
  };
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
    formData.append("skills", JSON.stringify(skills));
    if (avatar) formData.append("avatar", avatar);

    try {
      const result = await UpdateProfileAction(formData);
      if (!result) {
        throw new Error("failed to edit the changes");
      }
      setName("");
      setBio("");
      setSkill("");
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
      <div className="w-full md:w-1/6 max-w-6xl py-10">
        <Button
          variant="ghost"
          className="mb-6 text-gray-700 hover:text-black"
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
                  <Label htmlFor="skills" className="text-xl px-1 font-medium">
                    Skills
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="skills"
                      value={skill}
                      onChange={(e) => setSkill(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addSkill())
                      }
                      placeholder="Add a skill "
                      className="bg-white rounded-xl shadow-xl border-white/20 text-black"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addSkill}
                      className="rounded-xl border-white/20 bg-black text-white shadow-xl"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {skills.map((s) => (
                      <div
                        key={s}
                        className="flex items-center gap-1 bg-gray-200 text-black px-3 py-1 rounded-full shadow"
                      >
                        {" "}
                        <span>{s}</span>{" "}
                        <X
                          size={16}
                          className="cursor-pointer"
                          onClick={() => removeSkill(s)}
                        />{" "}
                      </div>
                    ))}
                  </div>
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
