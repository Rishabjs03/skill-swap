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
    <div className="w-full min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="w-full min-h-[80vh] flex flex-col items-center justify-center text-center px-6 md:px-0 py-12 md:py-24">
        <div className="flex flex-col items-center space-y-6 max-w-3xl mx-auto">
          <BlurText
            text="Learn, Teach, and Earn"
            delay={150}
            animateBy="words"
            direction="top"
            className="text-3xl sm:text-4xl md:text-6xl font-bold"
          />
          <BlurText
            text="Skills Effortlessly"
            delay={350}
            animateBy="words"
            direction="top"
            className="text-3xl sm:text-4xl md:text-6xl font-bold"
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
            className="text-sm sm:text-base md:text-lg font-medium text-gray-700 mt-4"
          />
          <button
            onClick={handleStart}
            className="mt-6 px-6 py-3 flex items-center gap-x-3 bg-black text-white font-medium rounded-full hover:scale-105 transition-transform"
          >
            <ArrowRight size={20} />
            Get started
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-23 md:py-28 px-6 md:px-0 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-12 md:mb-16">
          Why SkillSwap?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10 max-w-6xl mx-auto">
          {[
            {
              icon: <Users size={32} />,
              title: "Connect with Experts",
              desc: "Find mentors and professionals in any field quickly, and grow your network.",
              color: "#B996F5",
            },
            {
              icon: <Book size={32} />,
              title: "Learn New Skills",
              desc: "Access courses, coaching, and real-world advice to improve your abilities fast.",
              color: "#FF9A8B",
            },
            {
              icon: <Rocket size={32} />,
              title: "Grow Your Career",
              desc: "Showcase expertise, teach others, and earn as you level up professionally.",
              color: "#FFCE7B",
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              className="p-6 md:p-8 rounded-2xl shadow-md bg-white hover:shadow-2xl hover:translate-y-1 transition-all duration-500"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div
                className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full mx-auto mb-4 md:mb-6`}
                style={{ backgroundColor: card.color, color: "white" }}
              >
                {card.icon}
              </div>
              <h3 className="text-xl md:text-2xl font-semibold mb-2">
                {card.title}
              </h3>
              <p className="text-gray-600 text-sm md:text-base">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 px-6 md:px-0 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-10 md:mb-12">
          How It Works
        </h2>
        <div className="max-w-4xl mx-auto space-y-6">
          <Stepper
            initialStep={1}
            onFinalStepCompleted={() => console.log("All steps completed!")}
            backButtonText="Previous"
            nextButtonText="Next"
            className="space-y-6"
          >
            {[
              {
                step: 1,
                title: "Sign Up and Create Your Profile",
                desc: "Get started by creating a profile so others can find you.",
              },
              {
                step: 2,
                title: "Browse or List Skills",
                desc: "Explore available skills or showcase your own expertise.",
              },
              {
                step: 3,
                title: "Connect and Grow",
                desc: "Book a session, learn from experts, or teach to earn.",
              },
            ].map((s) => (
              <Step key={s.step}>
                <div className="relative flex flex-col md:flex-row items-start p-4 md:p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300">
                  <div className="absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-l-xl"></div>
                  <div className="ml-0 md:ml-6 mt-4 md:mt-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
                        {s.step}
                      </div>
                      <h3 className="text-lg md:text-xl font-semibold">
                        {s.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 mt-2 text-sm md:text-base">
                      {s.desc}
                    </p>
                  </div>
                </div>
              </Step>
            ))}
          </Stepper>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full flex flex-col md:flex-row justify-between items-center py-6 border-t px-6 md:px-8 mt-auto">
        <span className="text-black text-sm mb-4 md:mb-0">
          &copy; 2025 SkillSwap
        </span>
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
