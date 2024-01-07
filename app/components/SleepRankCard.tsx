import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

export default function SleepRankCard({ name, score, tracker, country, website }: { name: string, score: number, tracker: string, country: string, website: string }) {
  return (
    <div className="flex flex-col bg-gray-100 dark:bg-gray-800 ">
      <Card>
        <div className="flex items-center space-x-4 p-4">
          <Badge className="text-lg font-bold" variant="default">
            1
          </Badge>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback></AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <h3 className="text-lg font-bold">{name}</h3>
            <p className="text-gray-500 dark:text-gray-400">Sleep Score:  {score}</p>
             <p className="text-gray-500 dark:text-gray-400">
              Sleep Tracker: {tracker}
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              Location: {country}
            </p>
            <p className="text-gray-500 dark:text-gray-400">
            <Link className="text-blue-700 font-semibold" href={website}>
              Website
            </Link>
            </p>
          
          </div>
        </div>
      </Card>
    </div>
  );
}
