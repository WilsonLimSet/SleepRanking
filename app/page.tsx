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

  const sortedCardData = [...cardData].sort((a, b) => b.sleepScore - a.sleepScore);


  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex justify-between items-center border-b border-b-foreground/10 h-16 px-4">
        {/* Left side - Sleep Ranking title */}
        <h1 className="text-2xl font-bold">Sleep Ranking</h1>

        {/* Right side - Date picker, Upload, and Auth button */}
        <div className="flex items-center space-x-2">
          {/* <DatePickerWithPresets selectedDate={selectedDate} setSelectedDate={setSelectedDate}/> */}
          <UploadClient selectedDate={selectedDate}/>
          <AuthButton />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow">
        <div className="container mx-auto py-4">
            {/* Date picker centered above the cards */}
            <div className="flex justify-center my-4">
            <DatePickerWithPresets selectedDate={selectedDate} setSelectedDate={setSelectedDate}/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Map through cardData to render SleepRankCard for each user */}
            {sortedCardData.map((data, index) => (
        <SleepRankCard
          key={data.sleep_id}
          rank={index + 1} // Assign rank based on index after sorting
          avatar={data.profiles.avatar_url}
          name={data.profiles.full_name}
          score={data.sleepScore}
          tracker={data.profiles.sleep_tracker}
          country={data.profiles.country}
        />
      ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}