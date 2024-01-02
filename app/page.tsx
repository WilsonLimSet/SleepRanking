"use client";

import UploadClient from "./components/UploadClient";
import Footer from "./components/Footer";
import Header from "./components/Header";
import AuthButton from "./components/AuthButton";
import { DatePickerWithPresets } from "./components/DateComponent";
import { useState } from "react";
export default function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
          <p className="text-2xl font-bold ">Sleep Ranking</p>
          <div className="flex space-x-4">
            <UploadClient selectedDate={selectedDate}/>
          </div>
        </div>
        <AuthButton />
      </nav>
      <DatePickerWithPresets selectedDate={selectedDate} setSelectedDate={setSelectedDate }/>
      <Header />

      <Footer />
    </div>
  );
}
