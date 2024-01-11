"use client";
import { createClient } from "@/utils/supabase/client";

// Utility function to adjust date to PST
const adjustDateToPST = (date: Date) => {
  // PST is 8 hours behind UTC
  const PST_OFFSET = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
  return new Date(date.getTime() - PST_OFFSET);
};

export async function loadCardData(date: Date) {
  const supabase = createClient();

  const checkSleepUploads = async (date: Date) => {
    // Adjust the date to PST
    const adjustedDate = adjustDateToPST(date);

    // Format the adjusted date to YYYY-MM-DD
    const pstDate = adjustedDate.toISOString().split('T')[0];
    console.log(`Checking for uploads on ${pstDate} in PST`);

    try {
      let { data, error } = await supabase
        .from("sleepscores")
        .select(`
          *,
          profiles!inner(*)
        `)
        .eq("selectedDate", pstDate);  // We remove the user_id filter to get all user data

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
