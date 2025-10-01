"use click";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Clock, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

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
interface SkillCardProps {
  skill: skills;
}

const SkillCard: React.FC<SkillCardProps> = ({ skill }) => {
  const router = useRouter();
  return (
    <Card className="group overflow-hidden transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1 bg-gradient-subtle border-gray-200 border-2">
      <CardHeader className="pb-1">
        <div className="flex items-start justify-between">
          <Badge
            variant="secondary"
            className="mb-2   rounded-full text-sm bg-black text-white"
          >
            {skill.category}
          </Badge>
          {/* <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Star className="h-3 w-3 fill-warning text-warning" />
            <span className="font-medium">{averageRating.toFixed(1)}</span>
            <span>({totalBookings})</span>
          </div> */}
        </div>
        <h3 className="font-semibold text-xl leading-tight group-hover:text-primary transition-colors">
          {skill.title}
        </h3>
        <p className="text-sm font-medium text-gray-500 line-clamp-2">
          {skill.description}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space=x=3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={skill.owner.image || "/default.jpg"}
              alt={skill.owner.name!}
            />
            <AvatarFallback className="text-xs">
              {skill.owner
                .name!.split("")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 ">
            <Button
              variant="link"
              onClick={() => router.push(`/profile/${skill.owner.id}`)}
            >
              <p className="text-sm font-medium ">{skill.owner.name}</p>
            </Button>
            {/* <div className="flex items-center space-x-3 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 fill-warning text-warning" />
                <span>{owner.averageRating?.toFixed(1) || '5.0'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-3 w-3" />
                <span>{totalBookings} sessions</span>
              </div>
            </div> */}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4 text-medium" />
            <span className="text-sm text-muted-foreground">Per hour</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-black">${skill.rate}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            onClick={() => router.push(`/skills/${skill.id}`)}
            className="flex-1 hover:scale-103 transition-all"
          >
            View Details
          </Button>
          <Button
            onClick={() => router.push(`/skills/${skill.id}`)}
            className="flex-1 bg-black text-white hover:opacity-90 hover:scale-103 transition-all"
          >
            Book Now
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SkillCard;
