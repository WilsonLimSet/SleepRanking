"use client";

import UploadClient from "./components/UploadClient";
import Footer from "./components/Footer";
import Header from "./components/Header";
import AuthButton from "./components/AuthButton";
import { DatePickerWithPresets } from "./components/DateComponent";
import { useState, useEffect } from "react";
import SleepRankCard from "./components/SleepRankCard";
import { loadCardData } from "./components/loadCardData";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  useEffect(() => {
    // Function to fetch and set the data
    const fetchDataForDate = async () => {
      const data = await loadCardData(selectedDate);
      // Set the fetched data to the state
    };

    fetchDataForDate();
  }, [selectedDate]); // Re-fetch data whenever the selected date changes

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
     <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
  <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
    <p className="text-2xl font-bold">Sleep Ranking</p>
    <div className="flex items-center space-x-2 pr-1">
      <UploadClient selectedDate={selectedDate}/>
      <AuthButton />
    </div>
  </div>
</nav>
      <DatePickerWithPresets selectedDate={selectedDate} setSelectedDate={setSelectedDate }/>
      {/* <Header /> */}
      {/* <SleepRankCard/> */}

      {/* {sleepData && sleepData.map((dataItem: any, index:any) => (
        <SleepRankCard
          key={index}
          // Pass the appropriate props based on your SleepRankCard's expected props
          // Example props below (adjust according to actual data structure):
          name={dataItem.full_name}
          score={dataItem.sleep_score}
          tracker={dataItem.sleep_tracker}
          country={dataItem.country}
          website={dataItem.website}
          
        />
      ))} */}

      <Footer />
    </div>
  );
}
