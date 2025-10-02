"use client";

import { Button } from "@/components/ui/button";
import { LogOutIcon, MenuIcon, XIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { auth } from "@/lib/auth";
import { SignOut } from "@/lib/actions/auth";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type session = typeof auth.$Infer.Session;

const Navbar = ({ session }: { session: session | null }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    await SignOut();
    toast.success("Logged out successfully!");
    router.push("/auth/sign-in");
  }

  async function handleLogin() {
    router.push("/auth/sign-in");
  }

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "auto";
  }, [isMobileOpen]);

  const links = [
    { name: "Marketplace", href: "/skills" },
    { name: "Teach", href: "/skills/new" },
    { name: "Bookings", href: "/bookings" },
    {
      name: "Profile",
      href: session ? `/profile/${session.user.id}` : "/auth/sign-in",
    },
  ];

  return (
    <nav className="w-full max-w-6xl mx-auto mt-6 px-6 py-3 flex items-center justify-between bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-lg relative z-50">
      {/* Logo */}
      <div
        className="text-xl font-bold text-black cursor-pointer"
        onClick={() => router.push("/")}
      >
        SkillSwap
      </div>

      {/* Desktop Links */}
      <ul className="hidden md:flex  text-black font-medium">
        <li>
          <Button
            variant="ghost"
            onClick={() => router.push("/skills")}
            className={`hover:text-coral-500 rounded-xs text-md transition-colors ${
              pathname === "/skills"
                ? "border-b border-gray-800 font-medium"
                : ""
            }`}
          >
            Marketplace
          </Button>
        </li>
        {session && (
          <li>
            <Button
              variant="ghost"
              onClick={() => router.push("/skills/new")}
              className={`hover:text-coral-500 rounded-xs text-md transition-colors ${
                pathname === "/skills/new" ? "border-b border-gray-800" : ""
              }`}
            >
              Teach
            </Button>
          </li>
        )}
        <li>
          <Button
            variant="ghost"
            onClick={() => router.push("/bookings")}
            className={`hover:text-coral-500 rounded-xs text-md transition-colors ${
              pathname === "/bookings" ? "border-b border-gray-800" : ""
            }`}
          >
            Bookings
          </Button>
        </li>
      </ul>

      {/* Desktop Auth */}
      <div className="hidden md:flex items-center space-x-4">
        {!session ? (
          <Button
            onClick={handleLogin}
            variant="outline"
            className="text-white flex items-center bg-black border-white/30 hover:bg-black/70 cursor-pointer"
          >
            Login
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full border-0">
              <Avatar className="w-9 h-9">
                <AvatarImage src={session?.user.image || "/default.jpg"} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-30 flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white shadow-lg p-2 ">
              <DropdownMenuLabel className="text-sm font-medium text-gray-700">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => router.push(`/profile/${session?.user.id}`)}
                >
                  Profile
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="text-white bg-black border-white/30 hover:bg-black/70 cursor-pointer flex items-center gap-2"
                >
                  <LogOutIcon />
                  Logout
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          // <Button
          //   onClick={handleLogout}
          //   variant="outline"
          //   className="text-white bg-black border-white/30 hover:bg-black/70 cursor-pointer flex items-center gap-2"
          // >
          //   <LogOutIcon />
          //   Logout
          // </Button>
        )}
      </div>

      {/* Mobile Hamburger */}
      <div
        className="md:hidden z-50 cursor-pointer "
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <XIcon size={28} /> : <MenuIcon size={28} />}

        {/* Mobile Menu Overlay */}
        <div
          className={`fixed top-15 right-0 bg-white  rounded-xl z-[9999] w-xs transform transition-transform duration-300 flex flex-col items-center p-6 gap-4 ${
            isMobileOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          {links.map((link) => (
            <div
              key={link.name}
              onClick={() => {
                setIsMobileOpen(false);
                router.push(link.href);
              }}
              className="w-full text-center text-black font-medium hover:text-coral-500 transition-colors border-b border-gray-300 py-2 cursor-pointer"
            >
              {link.name}
            </div>
          ))}

          {/* Mobile Auth Button */}
          {!session ? (
            <Button
              variant="outline"
              onClick={() => {
                setIsMobileOpen(false);
                handleLogin();
              }}
              className="text-white bg-black border-white/30 hover:bg-black/70 cursor-pointer w-full mt-4"
            >
              Login
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => {
                setIsMobileOpen(false);
                handleLogout();
              }}
              className="text-white bg-black border-white/30 hover:bg-black/70 cursor-pointer w-full flex justify-center items-center gap-2 mt-4"
            >
              <LogOutIcon />
              Logout
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
