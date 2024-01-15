"use client";
import { createClient } from "@/utils/supabase/client";


export async function loadAllCardData() {
  const supabase = createClient();

  const checkAllSleepUploads = async () => {
 


    try {
      let { data, error } = await supabase
        .from("sleepscores")
        .select(`
          *,
          profiles!inner(*)
        `)
        

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

  return checkAllSleepUploads();
}
