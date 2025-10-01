"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOutIcon, MenuIcon, XIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/auth";
import { SignOut } from "@/lib/actions/auth";

type session = typeof auth.$Infer.Session;

const Navbar = ({ session }: { session: session | null }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    await SignOut();
    router.push("/auth/sign-in");
  }

  async function handleLogin() {
    router.push("/auth/sign-in");
  }

  // Lock scroll when mobile menu is open
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
      <ul className="hidden md:flex space-x-6 text-black font-medium">
        {links.map((link) =>
          link.name === "Teach" ? (
            <li key={link.name}>
              <div
                onClick={() => router.push(link.href)}
                className="hover:text-coral-500 transition-colors cursor-pointer"
              >
                {link.name}
              </div>
            </li>
          ) : (
            <li key={link.name}>
              <Link
                href={link.href}
                className="hover:text-coral-500 transition-colors"
              >
                {link.name}
              </Link>
            </li>
          )
        )}
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
          <Button
            onClick={handleLogout}
            variant="outline"
            className="text-white bg-black border-white/30 hover:bg-black/70 cursor-pointer flex items-center gap-2"
          >
            <LogOutIcon />
            Logout
          </Button>
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
            isMobileOpen ? "translate-x-0" : "translate-x-full"
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
