'use client'
import Link from "next/link";
import { Database } from '../database.types'
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Image from 'next/image';
import React, { useEffect, useState } from 'react';


export default function SleepRankCard({ avatar ,name, score, tracker, country}: { avatar:string, name: string, score: number, tracker: string, country: string}) {

  const supabase = createClientComponentClient<Database>();
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    async function downloadImage(path: string) {
      try {
        const { data, error } = await supabase.storage.from('avatars').download(path);
        if (error) {
          throw error;
        }
        const url = URL.createObjectURL(data);
        setAvatarUrl(url);
      } catch (error) {
        console.error('Error downloading image: ', error instanceof Error ? error.message : String(error));
      }
    }

    if (avatar) {
      downloadImage(avatar);
    }
  }, [avatar, supabase]);

  return (
    

    <div className="flex flex-col bg-gray-100 dark:bg-gray-800 ">
      <Card>
        <div className="flex items-center space-x-4 p-4">
          <Badge className="text-lg font-bold" variant="default">
            1
          </Badge>
          <Avatar>
            <AvatarImage src={avatarUrl} />
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
            {/* <Link className="text-blue-700 font-semibold" href={website}> */}
            {/* <Link className="text-blue-700 font-semibold" href={website}>
              Website
            </Link> */}
            </p>
          
          </div>
        </div>
      </Card>
    </div>
  );
}
