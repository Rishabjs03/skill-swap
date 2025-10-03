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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { GetUserRole } from "@/lib/actions/profile";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";

type session = typeof auth.$Infer.Session;

const Navbar = ({ session }: { session: session | null }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [role, setrole] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (session) {
      GetUserRole()
        .then((res) => {
          if (res && res.role) {
            setrole(res.role);
          } else {
            setrole("");
          }
        })
        .catch((err) => console.error(err));
    }
  }, [session]);
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
    { name: "Bookings", href: "/bookings" },
    {
      name: "Profile",
      href: session ? `/profile/${session.user.id}` : "/auth/sign-in",
    },
  ];

  return (
    <nav className="  w-full max-w-6xl relative mx-auto mt-6 px-6 py-3 flex items-center justify-between bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-lg  z-50">
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
            <DropdownMenuTrigger className="border-white rounded-full">
              <Avatar className="w-9 h-9">
                <AvatarImage src={session?.user.image || "/default.jpg"} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-44 rounded-xl border border-gray-200 bg-white shadow-lg py-2">
              <DropdownMenuLabel className="text-sm font-semibold text-gray-700 px-4 py-1">
                My Account
              </DropdownMenuLabel>

              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => router.push(`/profile/${session?.user.id}`)}
                >
                  Profile
                </DropdownMenuItem>
              </DropdownMenuGroup>

              {role === "Teacher" && (
                <>
                  <hr className="my-1 border-gray-300" />

                  <DropdownMenuLabel className="text-sm font-semibold text-gray-700 px-4 py-1">
                    Teacher Options
                  </DropdownMenuLabel>
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                      onClick={() => router.push("/skills/new")}
                    >
                      Teach
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </>
              )}

              <hr className="my-1 border-gray-300" />

              <DropdownMenuItem asChild>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full justify-start text-black border border-gray-300 hover:bg-gray-100 gap-2 px-4 py-2 rounded-lg"
                >
                  <LogOutIcon />
                  Logout
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden z-50 cursor-pointer ">
        <DropdownMenu open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <DropdownMenuTrigger asChild>
            <button className="p-1 rounded-full text-black">
              {isMobileOpen ? <XIcon size={28} /> : <MenuIcon size={28} />}
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side="bottom"
            align="end"
            className="w-56 bg-white rounded-xl border border-gray-200 shadow-lg py-2 flex flex-col"
          >
            {/* Links Group */}
            <DropdownMenuGroup>
              {links.map((link) => (
                <DropdownMenuItem
                  key={link.name}
                  onClick={() => {
                    setIsMobileOpen(false);
                    router.push(link.href);
                  }}
                  className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {link.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="my-1 border-gray-300" />

            {/* Teacher Options */}
            {role === "Teacher" && (
              <DropdownMenuGroup>
                <DropdownMenuLabel className="px-4 text-gray-700 font-semibold">
                  Teacher Options
                </DropdownMenuLabel>
                <DropdownMenuItem
                  className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    setIsMobileOpen(false);
                    router.push("/skills/new");
                  }}
                >
                  Teach
                </DropdownMenuItem>
              </DropdownMenuGroup>
            )}

            <DropdownMenuSeparator className="my-1 border-gray-300" />

            {/* Auth Button */}
            <DropdownMenuGroup>
              {!session ? (
                <DropdownMenuItem asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start px-4 py-2 rounded-lg text-black border border-gray-300 hover:bg-gray-100"
                    onClick={() => {
                      setIsMobileOpen(false);
                      handleLogin();
                    }}
                  >
                    Login
                  </Button>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start px-4 py-2 rounded-lg text-black border border-gray-300 hover:bg-gray-100 flex items-center gap-2"
                    onClick={() => {
                      setIsMobileOpen(false);
                      handleLogout();
                    }}
                  >
                    <LogOutIcon />
                    Logout
                  </Button>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
