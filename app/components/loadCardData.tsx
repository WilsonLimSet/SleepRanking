"use client";
import { createClient } from "@/utils/supabase/client";

// Utility function to adjust date to UTC
const adjustDateToUTC = (date: Date) => {
  // Get the local timezone offset and convert it to milliseconds
  const timezoneOffset = date.getTimezoneOffset() * 60 * 1000; // Local timezone offset in milliseconds
  // Adjust the date to UTC
  return new Date(date.getTime() - timezoneOffset);
};

export async function loadCardData(date: Date) {
  const supabase = createClient();

  const checkSleepUploads = async (date: Date) => {
    // Adjust the date to UTC
    const utcDate = adjustDateToUTC(date);

    // Format the adjusted date to YYYY-MM-DD
    const formattedDate = utcDate.toISOString().split('T')[0];
    console.log(`Checking for uploads on ${formattedDate} in UTC`);

    try {
      let { data, error } = await supabase
        .from("sleepscores")
        .select(`
          *,
          profiles!inner(*)
        `)
        .eq("selectedDate", formattedDate);  // We remove the user_id filter to get all user data

      if (error) {
        console.error("Error checking existing uploads:", error);
        return []; // Return an empty array in case of error
      }

      return data; // This will return the array of uploads or an empty array
    } catch (error) {
      console.error("Exception while checking existing uploads:", error);
      return []; // Return an empty array in case of any exception
    }
  };

  return checkSleepUploads(date);
}
