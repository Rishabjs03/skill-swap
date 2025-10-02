"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CreateSkill } from "@/lib/actions/skill";
import { ArrowLeft, PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import React, { useState } from "react";

const NewSkills = () => {
  const [Title, setTitle] = useState("");
  const [category, setcategory] = useState("");
  const [Rate, setRate] = useState(0);
  const [description, setdescription] = useState("");
  const [isloading, setisloading] = useState<boolean>(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setisloading(true);
    const formData = new FormData();
    formData.append("title", Title);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("rate", Rate.toString());
    try {
      const result = await CreateSkill(formData);
      if (!result) {
        toast.error("Failed to create skill!");
        throw new Error("failed to create skill");
        return;
      }
      toast.success("Listed your skill!");
      setTitle("");
      setdescription("");
      setcategory("");
      setRate(0);
      setisloading(false);
    } catch (error) {
      console.error("error in edit skill page:", error);
    }
  }
  return (
    <div className="min-h-[80vh] w-full flex justify-center items-center px-6 ">
      <div className="w-full md:w-1/4 max-w-6xl py-10">
        <Button
          variant="ghost"
          className="mb-6 text-medium  text-gray-700 hover:bg-black hover:text-white transition-all duration-300 hover:scale-105 "
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to home
        </Button>
        <div className="text-center mb-8 cursor-pointer">
          <h1 className="text-3xl font-bold mb-2">Share Your Expertise</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Create a skill listing to start teaching others and earning money
            from your knowledge and experience.
          </p>
        </div>
        <div className="grid">
          <Card className="relative overflow-hidden border border-white/30 backdrop-blur-xl bg-white shadow-2xl hover:scale-101 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-white opacity-20" />
            <CardHeader className="relative ">
              <div className="flex items-center justify-start flex-col gap-y-2 ">
                <h1 className=" flex items-center justify-start font-medium text-3xl cursor-pointer gap-2 ">
                  <PlusCircleIcon className="h-6 w-6 " />
                  Create Skills
                </h1>
              </div>
            </CardHeader>
            <CardContent className="flex relative flex-col items-center justify-center ">
              <form className="w-full space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-3">
                  <Label htmlFor="title" className="text-xl px-1 font-medium">
                    Skill Title
                  </Label>
                  <Input
                    type="text"
                    id="title"
                    value={Title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Python Programming Fundamentals"
                    required
                    className="bg-white rounded-xl shadow-xl border-white/20 text-black"
                  />
                </div>
                <div className="space-y-3">
                  <Label
                    htmlFor="category"
                    className="text-xl px-1 font-medium"
                  >
                    Category
                  </Label>
                  <Select
                    value={category}
                    onValueChange={(value) => setcategory(value)}
                    required
                  >
                    <SelectTrigger className="w-full bg-white rounded-xl shadow-xl border-white/20 text-black">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className="bg-white rounded-lg">
                        <SelectLabel>Category</SelectLabel>
                        <SelectItem value="Programming">Programming</SelectItem>
                        <SelectItem value="Design">Design</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Writing">Writing</SelectItem>
                        <SelectItem value="Business">Business</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="rate" className="text-xl px-1 font-medium">
                    Hour Rate
                  </Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                      $
                    </span>
                    <Input
                      type="number"
                      min={0}
                      id="price"
                      value={Rate}
                      required
                      onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
                      className="pl-8 bg-white rounded-xl shadow-xl border-white/20 text-black"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label
                    htmlFor="Description"
                    className="text-xl px-1 font-medium"
                  >
                    Description
                  </Label>

                  <Textarea
                    required
                    value={description}
                    onChange={(e) => setdescription(e.target.value)}
                    placeholder="Write your description.."
                    className=" bg-white rounded-xl shadow-xl border-white/20 text-black"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isloading}
                  onClick={() => router.push("/skills")}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-xl py-2 transition-all duration-300 shadow-md"
                >
                  {isloading ? <p>CreateBooking...</p> : <p>Create Skill</p>}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewSkills;
