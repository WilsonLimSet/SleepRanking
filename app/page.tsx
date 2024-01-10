"use client";

import { useState, useEffect } from "react";
import SleepRankCard from "./components/SleepRankCard";
import { loadCardData } from "./components/loadCardData";
import UploadClient from "./components/UploadClient";
import Footer from "./components/Footer";
import Header from "./components/Header"; // If you use it, import it.
import AuthButton from "./components/AuthButton";
import { DatePickerWithPresets } from "./components/DateComponent";

interface CardData {
  sleep_id: string;
  profiles: {
    avatar_url: string;
    full_name: string;
    sleep_tracker: string;
    country: string;
    website: string;
  };
  sleepScore: number;
}

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [cardData, setCardData] = useState<CardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDataForDate = async () => {
      setIsLoading(true);
      try {
        const data = await loadCardData(selectedDate);
        setCardData(data.sort((a, b) => b.sleepScore - a.sleepScore));
      } catch (error) {
        console.error('Error loading card data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataForDate();
  }, [selectedDate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  

  const sortedCardData = [...cardData].sort((a, b) => b.sleepScore - a.sleepScore);


  return (
    <div className="flex flex-col min-h-screen">
<header className="flex flex-wrap justify-between items-center border-b border-b-foreground/10 px-4">
        {/* Left side - Sleep Ranking title */}
        <h1 className="text-lg sm:text-2xl font-bold py-2">Sleep Ranking</h1> {/* Adjust the font size and add padding for mobile */}

        {/* Right side - Date picker, Upload, and Auth button */}
        <div className="flex items-center space-x-2">
          {/* <DatePickerWithPresets selectedDate={selectedDate} setSelectedDate={setSelectedDate}/> */}
          <UploadClient selectedDate={selectedDate}/>
          <AuthButton />
        </div>
      </header>

      {/* Main content */}
    
<main className="flex-grow">
  <div className="container mx-auto py-4 px-2 sm:px-4">
            {/* Date picker centered above the cards */}
            <div className="flex justify-center my-4">
            <DatePickerWithPresets selectedDate={selectedDate} setSelectedDate={setSelectedDate}/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">           {/* Map through cardData to render SleepRankCard for each user */}
            {isLoading ? (
            <div>Loading...</div>
          ) : cardData.length > 0 ? (
            cardData.map((data, index) => (
              <SleepRankCard
                key={data.sleep_id}
                rank={index + 1}
                avatar={data.profiles.avatar_url}
                name={data.profiles.full_name}
                score={data.sleepScore}
                tracker={data.profiles.sleep_tracker}
                country={data.profiles.country}
                website={data.profiles.website}
              />
            ))
          ) : (
            <div>No sleep data available for this date.</div>
          )}
        </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}