"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/utils/supabase/client";

type UploadClientProps = {
  selectedDate: Date;
};

export default function UploadClient({ selectedDate }: UploadClientProps) {
  const { toast } = useToast();
  const supabase = createClient();
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user data:", error);
      } else {
        console.log("Fetched user data:", user);
        setUser(user);
      }
    };

    fetchUser();
  }, [supabase.auth, toast]);

  const checkExistingUpload = async (userId: string, date: Date) => {
    // Format the date to YYYY-MM-DD
    const utcDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
                      .toISOString()
                      .split('T')[0];
  
    console.log(`Checking for existing upload on ${utcDate} for user ${userId}`);
  
    try {
      let { data, error } = await supabase
        .from("sleepscores")
        .select("*")
        // .eq("user_id", userId)
        // // .eq('selectedDate', utcDate);
        // .from("profiles")
        // .select(`full_name, website, avatar_url, sleep_tracker, country`)
        // .eq("id", user?.id ?? "")

        console.log('Data returned:', data);
        console.log('Error:', error);
  
      if (error) {
        console.error('Error checking existing upload:', error);
        throw error;
      }
  
      return data && data.length > 0;
    } catch (error) {
      console.error('Exception while checking existing upload:', error);
      return false; // Return false in case of any exception
    }
  };


  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user) {
      toast({
        variant: "destructive",
        title: "You Must Sign In to Upload Sleep Data",
      });
      return;
    }

    try {
      // Check if data has already been uploaded for the selected date
      const alreadyUploaded = await checkExistingUpload(user.id, selectedDate);
      if (alreadyUploaded) {
        toast({
          variant: "destructive",
          title: "Sleep for this date has already been uploaded",
        });
        return;
      }

      // Convert the selected date to UTC
      const utcDate = new Date(
        Date.UTC(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate()
        )
      );

      try {
        const { error } = await supabase
          .from("sleepscores")
          .insert({
            user_id: user.id,
            sleepScore: "88",
            selectedDate: utcDate,
          });

        if (error) {
          console.error("Error in uploading data:", error);
          throw error;
        }

        console.log("Data uploaded successfully.");
        toast({ variant: "default", title: "Data uploaded successfully" });
      } catch (error) {
        console.error("Exception in upload:", error);
        toast({ variant: "destructive", title: "Error in uploading data" });
      }
    } catch (error) {
      console.error("Exception in upload:", error);
      toast({ variant: "destructive", title: "Error in uploading data" });
    }
  };

  return (
    <div className="flex items-center gap-4">
      <form onSubmit={handleUpload}>
        <Button variant="outline">Upload</Button>
      </form>
    </div>
  );
}
