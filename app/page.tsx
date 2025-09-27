"use client";
import React from "react";
import Background from "./components/Background";

import { ArrowRight, Github, Twitter } from "lucide-react";

import Link from "next/link";

export default function page() {
  return (
    <div className="w-full min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="relative w-full h-[70vh] flex flex-col items-center justify-center text-center">
        <Background />
        <div className="z-10 flex flex-col items-center justify-center space-y-5 px-4">
          <p className="text-3xl pt-10 md:pt-0 md:text-6xl md:leading-[5rem] font-bold transition">
            Learn, Teach, and Earn <br />
            Skills Effortlessly
          </p>
          <p className="font-medium text-sm md:text-xl p-2">
            Find tutors, designers, developers, and more in your area — book
            their skills instantly.
          </p>
          <button className="text-white font-medium bg-black border-white/30 hover:bg-black/70 cursor-pointer px-3 py-2 md:px-4 md:py-3 flex gap-x-3 rounded-full">
            <ArrowRight />
            Get started
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full flex justify-between items-center py-4 border-t border-white/20 mt-auto">
        <div className="flex items-center  gap-x-3 ml-3">
          <span className="text-light text-sm">&copy; 2025 SkillSwap</span>
        </div>
        <div className="flex items-center gap-x-4 mr-3 ">
          <Link href="https://github.com/Rishabjs03">
            <Github className="text-black hover:text-white cursor-pointer" />
          </Link>
          <Link href="https://x.com/Yrishavjs">
            <Twitter className="text-black hover:text-white cursor-pointer" />
          </Link>
        </div>
      </footer>
    </div>
  );
}
