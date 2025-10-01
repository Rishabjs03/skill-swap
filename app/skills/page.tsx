"use client";
import { Badge } from "@/components/ui/badge";
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
import { Grid, List, PlusCircle, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import SkillCard from "../components/SkillCard";

interface skills {
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
    image?: string | null;
  };
}

const SkillMarket = () => {
  const [search, setsearch] = useState("");
  const [category, setcategory] = useState("");
  const [rate, setrate] = useState("");
  const [skills, setskills] = useState<skills[]>([]);
  const [isBadge, setisBadge] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const router = useRouter();
  const fetchSkills = async () => {
    const result = await getAllSkills({ search, category, rate });
    setskills(result);
  };
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchSkills();
      setisBadge(true);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
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
        <div className="bg-white/60 w-full  rounded-xl md:rounded-full p-4 md:p-6 mb-8 border-gray-200 border-2">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={search}
                onChange={(e) => setsearch(e.target.value)}
                placeholder="Search skills, mentors or topics..."
                className="pl-10 bg-white border-gray-200 border-2 rounded-xl shadow-md"
              />
            </div>

            {/* Category Select */}
            <Select value={category} onValueChange={(v) => setcategory(v)}>
              <SelectTrigger className="w-full md:w-48 bg-white rounded-xl shadow-md border-gray-200 border-2 text-black">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent className=" border-gray-200 border-2">
                <SelectGroup className="bg-white ">
                  <SelectLabel>Category</SelectLabel>
                  <SelectItem value="Programming">Programming</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Writing">Writing</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Price Select */}
            <Select value={rate} onValueChange={(v) => setrate(v)}>
              <SelectTrigger className="w-full md:w-40 bg-white rounded-xl shadow-md border-gray-200 border-2">
                <SelectValue placeholder="All prices" />
              </SelectTrigger>
              <SelectContent className=" border-gray-200 border-2">
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
                setisBadge(false);
              }}
              className="md:w-auto w-full bg-black text-white shadow-lg hover:scale-105 transition-all rounded-xl"
            >
              Clear
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <span className="text-lg font-extralight">
              {skills.length} skill{skills.length !== 1 ? "s" : ""} found
            </span>
            {isBadge && (
              <div className="flex flex-wrap gap-2">
                {category && (
                  <Badge
                    variant="secondary"
                    className="px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-700"
                  >
                    Category: {category}
                  </Badge>
                )}
                {rate && (
                  <Badge
                    variant="secondary"
                    className="px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-700"
                  >
                    Price: {rate}
                  </Badge>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="bg-black text-white rounded-lg hover:scale-105 transition-all"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="bg-black text-white rounded-lg hover:scale-105 transition-all"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {skills.length > 0 ? (
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
            }`}
          >
            {skills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No skills found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or filters
            </p>
            <Button
              onClick={() => {
                setsearch("");
                setcategory("");
                setrate("");
                setisBadge(false);
              }}
              className="bg-black text-white"
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillMarket;
