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
    // website: string;
  };
  sleepScore: number;
}

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [cardData, setCardData] = useState<CardData[]>([]); // Add the CardData type to the state

  useEffect(() => {
    // Function to fetch and set the data
    const fetchDataForDate = async () => {
      const data = await loadCardData(selectedDate);
      setCardData(data); // Set the fetched data to the state
    };

    fetchDataForDate();
  }, [selectedDate]); // Re-fetch data whenever the selected date changes

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      {/* Include the Header component here if you use it */}
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
          <p className="text-2xl font-bold">Sleep Ranking</p>
          <div className="flex items-center space-x-2 pr-1">
            <UploadClient selectedDate={selectedDate}/>
            <AuthButton />
          </div>
        </div>
      </nav>
      <DatePickerWithPresets selectedDate={selectedDate} setSelectedDate={setSelectedDate}/>

      {/* Map through cardData to render SleepRankCard for each user */}
      {cardData.map((data) => (
        <SleepRankCard
          key={data.sleep_id} // Assuming sleep_id is unique
          avatar={data.profiles.avatar_url}
          name={data.profiles.full_name}
          score={data.sleepScore}
          tracker={data.profiles.sleep_tracker}
          country={data.profiles.country}
          // website={data.profiles.website}
        />
      ))}

      <Footer />
    </div>
  );
}
