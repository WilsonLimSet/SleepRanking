"use client";

import { useState, useEffect } from "react";
import SleepRankCard from "./components/SleepRankCard";
import AllSleepRankCard from "./components/AllSleepRankCard";
import { loadCardData } from "./components/loadCardData";
import UploadClient from "./components/UploadClient";
import { loadAllCardData } from "./components/loadAllCardData";
import Footer from "./components/Footer";
import Header from "./components/Header"; // If you use it, import it.
import AuthButton from "./components/AuthButton";
import { DatePickerWithPresets } from "./components/DateComponent";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

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

interface AllCardData {
  sleep_id: string;
  profiles: {
    avatar_url: string;
    full_name: string;
    sleep_tracker: string;
    country: string;
    website: string;
  };
  sleepScore: number;
  selectedDate: string;
}

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [cardData, setCardData] = useState<CardData[]>([]);
  const [allCardData, setAllCardData] = useState<AllCardData[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isAllTimeSelected, setIsAllTimeSelected] = useState(false); // State to track the "All Time" switch

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setIsLoading(true);

      try {
        let data = [];

        if (isAllTimeSelected) {
          // Fetch all-time data
          data = (await loadAllCardData()) || [];
          data = data.sort((a, b) => b.sleepScore - a.sleepScore).slice(0, 6);

          if (mounted) {
            setAllCardData(data);
          }
        } else {
          // Fetch daily data
          data = (await loadCardData(selectedDate)) || [];
          if (mounted) {
            setCardData(data);
          }
        }
      } catch (error) {
        console.error("Error loading card data:", error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false; // Cleanup function to prevent setting state on unmounted component
    };
  }, [selectedDate, isAllTimeSelected]);

  // Sort data just before rendering to avoid redundancy
  const sortedCardData = [...(cardData || [])].sort(
    (a, b) => b.sleepScore - a.sleepScore
  );

  const handleSwitchChange = () => {
    setIsAllTimeSelected(!isAllTimeSelected);
  };
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between border-b border-gray-200 ">
        {/* Left side - Sleep Ranking title, ensure it takes space with flex-1 */}
        <div className="flex-1">
          <h1 className="text-xl font-bold whitespace-nowrap pr-4">
            Sleep Ranking
          </h1>
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
            <div className="flex items-center space-x-2">
              <div>
                <Label htmlFor="airplane-mode">Daily</Label>
              </div>
              <div>
                <Switch
                  id="airplane-mode"
                  checked={isAllTimeSelected}
                  onCheckedChange={(checked) => setIsAllTimeSelected(checked)}
                />
              </div>
              <div>
                <Label htmlFor="airplane-mode">All Time</Label>
              </div>
            </div>
          </div>

          {isAllTimeSelected ? (
            <div className="flex justify-center my-4">
              <h2 className="text-xl font-semibold">Top 6 Best Sleep Scores</h2>
            </div>
          ) : (
            <div className="flex justify-center my-4">
              <DatePickerWithPresets
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {" "}
            {isLoading ? (
              <div>Loading...</div>
            ) : isAllTimeSelected ? (
              allCardData.map((data, index) => (
                <AllSleepRankCard
                  key={data.sleep_id}
                  rank={index + 1}
                  avatar={data.profiles.avatar_url}
                  name={data.profiles.full_name}
                  score={data.sleepScore}
                  tracker={data.profiles.sleep_tracker}
                  country={data.profiles.country}
                  website={data.profiles.website}
                  selectedDate={data.selectedDate}
                  // Include other props specific to AllSleepRankCard
                />
              ))
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
              <div>
                {isAllTimeSelected
                  ? "This is all-time data."
                  : "No sleep data available for this date."}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
