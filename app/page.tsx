"use client";
import React from "react";
import { ArrowRight, Book, Users, Rocket, Github, Twitter } from "lucide-react";
import BlurText from "@/components/BlurText";
import TextType from "@/components/TextType";
import Stepper, { Step } from "@/components/Stepper";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/context/auth-context";

export default function Homepage() {
  const { user } = useAuth();
  const router = useRouter();

  function handleStart() {
    if (!user) {
      router.push("/auth/sign-in");
    } else {
      router.push("/skills");
    }
  }

  return (
    <div className="w-full min-h-screen relative z-10 flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center text-center z-10">
        <div className="flex flex-col items-center space-y-6 px-4">
          <BlurText
            text="Learn, Teach, and Earn"
            delay={150}
            animateBy="words"
            direction="top"
            className="text-4xl md:text-6xl font-bold"
          />
          <BlurText
            text="Skills Effortlessly"
            delay={350}
            animateBy="words"
            direction="top"
            className="text-4xl md:text-6xl font-bold"
          />
          <TextType
            text={[
              "Find tutors, designers, developers, and more in your area — book their skills instantly.",
              "Build your network, learn faster, and grow your career.",
              "Teach what you know, earn as you grow!",
            ]}
            typingSpeed={50}
            deletingSpeed={30}
            showCursor={true}
            pauseDuration={1500}
            style={{ color: "black" }}
            className="font-medium text-sm md:text-xl max-w-2xl"
          />
          <button
            onClick={handleStart}
            className="text-white hover:scale-105 transition-all font-medium bg-black hover:bg-black/80 px-6 py-3 flex gap-x-3 rounded-full mt-4"
          >
            <ArrowRight /> Get started
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 text-center ">
        <h2 className="text-3xl md:text-4xl font-bold mb-16">Why SkillSwap?</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {/* Card 1 */}
          <motion.div
            className="p-8 rounded-2xl shadow-md bg-white hover:shadow-2xl hover:translate-y-2 transition-all duration-500"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#B996F5] text-white mx-auto mb-6">
              <Users size={32} />
            </div>
            <h3 className="text-2xl font-semibold mb-3">
              Connect with Experts
            </h3>
            <p className="text-gray-600">
              Find mentors and professionals in any field quickly, and grow your
              network.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            className="p-8 rounded-2xl shadow-md bg-white hover:shadow-2xl hover:translate-y-2 transition-all duration-500"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#FF9A8B] text-white mx-auto mb-6">
              <Book size={32} />
            </div>
            <h3 className="text-2xl font-semibold mb-3">Learn New Skills</h3>
            <p className="text-gray-600">
              Access courses, coaching, and real-world advice to improve your
              abilities fast.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            className="p-8 rounded-2xl shadow-md bg-white hover:shadow-2xl hover:translate-y-2 transition-all duration-500"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#FFCE7B] text-white mx-auto mb-6">
              <Rocket size={32} />
            </div>
            <h3 className="text-2xl font-semibold mb-3">Grow Your Career</h3>
            <p className="text-gray-600">
              Showcase expertise, teach others, and earn as you level up
              professionally.
            </p>
          </motion.div>
        </div>
      </section>
      {/* How It Works Section */}
      <section className="py-24 text-center ">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">How It Works</h2>
        <div className="max-w-4xl mx-auto">
          <Stepper
            initialStep={1}
            onFinalStepCompleted={() => console.log("All steps completed!")}
            backButtonText="Previous"
            nextButtonText="Next"
            className="space-y-6"
          >
            <Step>
              <div className="relative flex items-start p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300">
                <div className="absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-l-xl"></div>
                <div className="ml-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
                      1
                    </div>
                    <h3 className="text-xl font-semibold">
                      Sign Up and Create Your Profile
                    </h3>
                  </div>
                  <p className="text-gray-600 mt-2">
                    Get started by creating a profile so others can find you.
                  </p>
                </div>
              </div>
            </Step>
            <Step>
              <div className="relative flex items-start p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300">
                <div className="absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-l-xl"></div>
                <div className="ml-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
                      2
                    </div>
                    <h3 className="text-xl font-semibold">
                      Browse or List Skills
                    </h3>
                  </div>
                  <p className="text-gray-600 mt-2">
                    Explore available skills or showcase your own expertise.
                  </p>
                </div>
              </div>
            </Step>
            <Step>
              <div className="relative flex items-start p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300">
                <div className="absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-l-xl"></div>
                <div className="ml-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
                      3
                    </div>
                    <h3 className="text-xl font-semibold">Connect and Grow</h3>
                  </div>
                  <p className="text-gray-600 mt-2">
                    Book a session, learn from experts, or teach to earn.
                  </p>
                </div>
              </div>
            </Step>
          </Stepper>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full flex flex-col md:flex-row justify-between items-center py-4 border-t px-8 mt-auto">
        <div className="mb-4 md:mb-0">
          <span className="text-black text-sm">&copy; 2025 SkillSwap</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="https://github.com/Rishabjs03">
            <Github className="text-black hover:text-gray-600 cursor-pointer" />
          </Link>
          <Link href="https://x.com/Yrishavjs">
            <Twitter className="text-black hover:text-gray-600 cursor-pointer" />
          </Link>
        </div>
      </footer>
    </div>
  );
}
