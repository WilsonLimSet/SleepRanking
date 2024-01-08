"use client";
import { createClient } from "@/utils/supabase/client";

export async function loadCardData(date: Date) {
  const supabase = createClient();

  const checkSleepUploads = async (date: Date) => {
    // Format the date to YYYY-MM-DD
    const utcDate = date.toISOString().split('T')[0];
    console.log(`Checking for uploads on ${utcDate}`);

    try {
      let { data, error } = await supabase
        .from("sleepscores")
        .select(`
          *,
          profiles!inner(*)
        `)
        .eq("selectedDate", utcDate);  // We remove the user_id filter to get all user data


      if (error) {
        console.error("Error checking existing uploads:", error);
        return null; // Return null in case of error
      }

      return data; // This will return the array of uploads or an empty array
    } catch (error) {
      console.error("Exception while checking existing uploads:", error);
      return null; // Return null in case of any exception
    }
  };

  // Now you can use the checkSleepUploads function to load the data
  const uploads = await checkSleepUploads(date);
  if (uploads) {
    console.log('Uploads found:', uploads);
    return uploads; // Return the uploads data
  } else {
    console.log('No uploads found for this date.');
    return []; // Return an empty array if no uploads were found
  }
}
