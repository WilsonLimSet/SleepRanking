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
    let mounted = true;
    const fetchDataForDate = async () => {
      setIsLoading(true);
      try {
        const data = await loadCardData(selectedDate);
        if (data && mounted) {
          // No need to sort here if you're going to sort again before rendering
          setCardData(data);
        }
      } catch (error) {
        console.error("Error loading card data:", error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchDataForDate();

    return () => {
      mounted = false; // Cleanup function to prevent setting state on unmounted component
    };
  }, [selectedDate]);

  // Sort data just before rendering to avoid redundancy
  const sortedCardData = [...(cardData || [])].sort(
    (a, b) => b.sleepScore - a.sleepScore
  );

  return (
    <div className="flex flex-col min-h-screen">
   <header className="flex items-center justify-between border-b border-gray-200 ">
  {/* Left side - Sleep Ranking title, ensure it takes space with flex-1 */}
  <div className="flex-1">
    <h1 className="text-xl font-bold whitespace-nowrap pr-4">Sleep Ranking</h1>
  </div>

  {/* Spacer element to allow the title and profile to sit at extremes */}
  <div className="flex-1"></div> 

  {/* Right side - Upload, and Auth button, also using flex-1 to take space */}
  <div className="flex-1 flex justify-end py-1 ">
  <div className="mr-2">
    <UploadClient selectedDate={selectedDate} />
    </div>
    <AuthButton />
  </div>
</header>
      {/* Main content */}

      <main className="flex-grow">
        <div className="container mx-auto py-4 px-2 sm:px-4">
          {/* Date picker centered above the cards */}
          <div className="flex justify-center my-4">
            <DatePickerWithPresets
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {" "}
            {/* Map through cardData to render SleepRankCard for each user */}
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
