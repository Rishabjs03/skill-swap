"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllSkills } from "@/lib/actions/skill";
import { PlusCircle, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface skills {
  id: string;
  title: string;
  description: string;
  category: string | null;
  rate: number;
  ownerId: string;
  createdAt: Date;
}

const SkillMarket = () => {
  const [search, setsearch] = useState("");
  const [category, setcategory] = useState("");
  const [rate, setrate] = useState("");
  const [skills, setskills] = useState<skills[]>([]);
  const router = useRouter();

  const fetchSkills = async () => {
    const result = await getAllSkills({ search, category, rate });
    console.log(result);
    // setskills(result);
  };
  useEffect(() => {
    fetchSkills();
  }, [search, category, rate]);

  return (
    <div className="min-h-[70vh] w-full px-4 md:px-8 lg:px-16">
      <div className="w-full py-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-12">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl md:text-4xl font-semibold mb-2">
              Browse Skills
            </h1>
            <p className="text-base md:text-lg font-light text-gray-600">
              Discover expert mentors and book personalized learning sessions
            </p>
          </div>
          <Button
            className="bg-black text-white font-medium px-6 py-3 rounded-lg shadow-md hover:scale-105 transition-transform"
            onClick={() => router.push("/skills/new")}
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Teach a Skill
          </Button>
        </div>

        {/* Search + Filters */}
        <div className="bg-white/60 w-full shadow-xl rounded-2xl p-4 md:p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={search}
                onChange={(e) => setsearch(e.target.value)}
                placeholder="Search skills, mentors or topics..."
                className="pl-10 bg-white border rounded-xl shadow-lg"
              />
            </div>

            {/* Category Select */}
            <Select value={category} onValueChange={(v) => setcategory(v)}>
              <SelectTrigger className="w-full md:w-48 bg-white rounded-xl shadow-lg border text-black">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup className="bg-white shadow-xl">
                  <SelectLabel>Category</SelectLabel>
                  <SelectItem value="programming">Programming</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="writing">Writing</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Price Select */}
            <Select value={rate} onValueChange={(v) => setrate(v)}>
              <SelectTrigger className="w-full md:w-40 bg-white rounded-xl shadow-lg border">
                <SelectValue placeholder="All prices" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup className="bg-white ">
                  <SelectLabel>Price Range</SelectLabel>
                  <SelectItem value="0-50">$0 - $50</SelectItem>
                  <SelectItem value="50-100">$50 - $100</SelectItem>
                  <SelectItem value="100-150">$100 - $150</SelectItem>
                  <SelectItem value="150-999">$150+</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Clear Button */}
            <Button
              variant="outline"
              onClick={() => {
                setsearch("");
                setcategory("");
                setrate("");
              }}
              className="md:w-auto w-full bg-black text-white shadow-lg hover:scale-105 transition-all rounded-xl"
            >
              Clear
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillMarket;
