"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HamburgerIcon, MenuIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [isMobileOpen, setisMobileOpen] = useState<boolean>(false);
  const router = useRouter();
  return (
    <nav
      className="
        w-full max-w-6xl mx-auto mt-6 px-6 py-3
        flex items-center justify-between
        bg-white/10 backdrop-blur-lg
        border border-white/20 rounded-2xl
        shadow-lg
      "
    >
      {/* Logo / Brand */}
      <div
        className="text-xl font-bold text-black cursor-pointer"
        onClick={() => router.push("/")}
      >
        SkillSwap
      </div>

      {/* Desktop Links */}
      <ul className="hidden md:flex space-x-6 text-black font-medium">
        <li>
          <Link
            href="/skills"
            className="hover:text-coral-500 transition-colors"
          >
            Marketplace
          </Link>
        </li>
        <li>
          <Link
            href="/bookings"
            className="hover:text-coral-500 transition-colors"
          >
            My Bookings
          </Link>
        </li>
        <li>
          <Link
            href="/profile"
            className="hover:text-coral-500 transition-colors"
          >
            Profile
          </Link>
        </li>
      </ul>

      {/* Auth / Action Button */}
      <div className=" items-center space-x-4 hidden md:flex">
        <Link href="/auth/sign-in">
          <Button
            variant="outline"
            className="text-white bg-black border-white/30 hover:bg-black/70 cursor-pointer"
          >
            Login
          </Button>
        </Link>
      </div>
      {/* mobile layout */}
      <div className="md:hidden" onClick={() => setisMobileOpen(!isMobileOpen)}>
        {isMobileOpen ? <XIcon /> : <MenuIcon />}
      </div>
      {isMobileOpen && (
        <div className="fixed top-15 right-0 w-64 h-[200px] z-90 flex flex-col items-center bg-white/95 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-6 gap-4 transition-opacity from-5% to-100%">
          <Link
            href="/skills"
            className="text-black font-medium hover:text-coral-500 transition-colors border-b border-gray-300 w-full text-center "
            onClick={() => setisMobileOpen(false)}
          >
            Marketplace
          </Link>
          <Link
            href="/bookings"
            className="text-black font-medium hover:text-coral-500 transition-colors border-b border-gray-300 w-full text-center"
            onClick={() => setisMobileOpen(false)}
          >
            My Bookings
          </Link>
          <Link
            href="/profile"
            className="text-black font-medium hover:text-coral-500 transition-colors border-b border-gray-300 w-full text-center"
            onClick={() => setisMobileOpen(false)}
          >
            Profile
          </Link>
          <Link href="/auth/sign-in" onClick={() => setisMobileOpen(false)}>
            <Button
              variant="outline"
              className="text-white bg-black border-white/30 hover:bg-black/70 cursor-pointer"
            >
              Login
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
