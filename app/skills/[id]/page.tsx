"use client";
import BookingForm from "@/app/components/BookingForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GetSessionUser } from "@/lib/actions/session";
import { getSkill } from "@/lib/actions/skill";
import { ArrowLeft, Calendar, CheckCircle, Clock } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

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
    bio?: string | null;
  };
}

const SingleSkillPage = () => {
  const [showBookingForm, setshowBookingForm] = useState(false);
  const [skill, setSkill] = useState<skills | null>(null);

  const router = useRouter();
  const pathName = usePathname();

  const skillId = pathName.split("/").pop() || "";

  useEffect(() => {
    async function loadSkills() {
      try {
        const result = await getSkill(skillId);
        console.log(result);
        setSkill(result);
      } catch (error) {
        console.log("error in single skill fetching", error);
      }
    }
    loadSkills();
  }, [skillId]);
  return (
    <div className="min-h-[70vh]  w-full px-4 md:px-8 lg:px-16">
      <div className="w-full py-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="hover:bg-black hover:text-white transition-all mb-7"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Skills
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-gray-200 border-2 shadow-lg">
              <CardHeader>
                <div className="space-y-4">
                  <Badge
                    variant="secondary"
                    className="w-fit bg-black text-white "
                  >
                    {skill?.category}
                  </Badge>
                  <h1 className="text-3xl font-semibold">{skill?.title}</h1>
                  <div className="flex items-center space-x-6 text-sm">
                    {/* <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-warning text-warning" />
                      <span className="font-medium">{averageRating.toFixed(1)}</span>
                      <span className="text-muted-foreground">({totalBookings} reviews)</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{totalBookings} students</span>
                    </div> */}
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>1-on-1 sessions</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-medium text-gray-600 font-light leading-relaxed">
                  {skill?.description}
                </p>
              </CardContent>
            </Card>
            <Card className="border-gray-200 border-2 bg-white shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Meet Your Instructor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={skill?.owner.image || "/default.jpg"}
                      alt={skill?.owner.name || "User"}
                    />
                    <AvatarFallback className="text-lg">U</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div>
                      <Button
                        variant="link"
                        onClick={() =>
                          router.push(`/skills/profile/${skill?.owner.id}`)
                        }
                      >
                        <h3 className="text-xl font-semibold">
                          {skill?.owner.name}
                        </h3>
                      </Button>
                      {/* <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 fill-warning text-warning" />
                          <span>{owner.averageRating?.toFixed(1) || '5.0'} rating</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>{totalBookings} students taught</span>
                        </div>
                      </div> */}
                    </div>
                    {skill?.owner.bio && (
                      <p className="text-sm font-light text-gray-600 pl-4">
                        {skill?.owner.bio}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className=" bg-white shadow-xl border-gray-200 border-2">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  What You&apos;ll Learn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {[
                    "Modern development best practices and patterns",
                    "Real-world project experience and code reviews",
                    "Industry-standard tools and workflows",
                    "Personalized feedback and mentorship",
                    "Problem-solving techniques and debugging skills",
                  ].map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {!showBookingForm ? (
                <Card className="bg-white shadow-xl border-gray-200 border-2">
                  <CardHeader>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-2">
                        ${skill?.rate}
                        <span className="text-base font-normal text-muted-foreground">
                          /hour
                        </span>
                      </div>
                      {/* <div className="flex items-center justify-center space-x-1 text-sm">
                        <Star className="h-4 w-4 fill-warning text-warning" />
                        <span className="font-medium">{averageRating.toFixed(1)}</span>
                        <span className="text-muted-foreground">({totalBookings} reviews)</span>
                      </div> */}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <Button
                      className="w-full bg-gradient-primary hover:opacity-90"
                      size="lg"
                      onClick={() => setshowBookingForm(true)}
                    >
                      <div className="bg-black text-white  flex items-center justify-center py-2 px-3 rounded-lg">
                        <Calendar className="mr-2 h-4 w-4" />
                        Book a Session
                      </div>
                    </Button>

                    <div className="text-center text-sm text-muted-foreground">
                      100% satisfaction guarantee
                    </div>

                    <div className="space-y-3 pt-4 border-t">
                      <div className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 text-success" />
                        <span>Instant confirmation</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="h-4 w-4  text-green-600 text-success" />
                        <span>Flexible cancellation</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 text-success" />
                        <span>1-on-1 personalized session</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4 ">
                  <Button
                    variant="ghost"
                    onClick={() => setshowBookingForm(false)}
                    className="w-full"
                  >
                    <div className="hover:bg-black hover:text-white transition-all flex items-center justify-center py-2 px-3 rounded-lg">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Details
                    </div>
                  </Button>
                  {showBookingForm && skill && <BookingForm skill={skill} />}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleSkillPage;
