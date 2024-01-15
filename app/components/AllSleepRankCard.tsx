import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '../database.types';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { COUNTRIES } from '../lib/countries'; // Ensure the path is correct

export default function AllSleepRankCard({ rank, avatar, name, score, tracker, country,website,selectedDate }: {rank:number,  avatar: string, name: string, score: number, tracker: string, country: string,website:string,selectedDate:string}) {
  const supabase = createClientComponentClient<Database>();
  const [avatarUrl, setAvatarUrl] = useState('');
  
  const getCountryDetails = (countryCode: string) => {
    const countryObject = COUNTRIES.find(country => country.value === countryCode);
    return countryObject || { title: 'Unknown Country', value: countryCode };
  };

  const countryDetails = getCountryDetails(country);

  const formatUrl = (url:string) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  };

  useEffect(() => {
    const downloadImage = async (path: string) => {
      try {
        const { data, error } = await supabase.storage.from('avatars').download(path);
        if (error) throw error;
        setAvatarUrl(URL.createObjectURL(data));
      } catch (error) {
        console.error('Error downloading image: ', (error as Error).message || String(error));
      }
    };

    if (avatar) downloadImage(avatar);
  }, [avatar]);

  return (
    <div className="flex flex-col bg-gray-100 dark:bg-gray-800">
      <Card>
        <div className="flex items-center p-4">
          <div className="flex flex-col items-center mr-4">
            <Avatar className="mb-2">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback />
            </Avatar>
            <Badge className="text-lg font-bold" variant="default">{rank}</Badge>
          </div>
          <div className="space-y-2 flex-grow">
            {/* Conditional rendering for name as a link or plain text */}
            {website ? (
              <a href={formatUrl(website)} target="_blank" rel="noopener noreferrer" className="text-lg font-bold hover:underline">
                {name}
              </a>
            ) : (
              <h3 className="text-lg font-bold">{name}</h3>
            )}
             <p className="font-semibold text-gray-500 dark:text-gray-400">Date: {selectedDate}</p>
            <p className="font-semibold text-gray-500 dark:text-gray-400">Sleep Score: {score}</p>
            <p className="font-semibold text-gray-500 dark:text-gray-400">Tracker: {tracker}</p>
            <div className="flex items-center">
              <img
                alt={`${countryDetails.value}`}
                src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${countryDetails.value}.svg`}
                className="inline mr-2 h-4 rounded-sm"
              />
              <p className="font-semibold text-gray-500 dark:text-gray-400">{countryDetails.title}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
