"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/utils/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type UploadClientProps = {
  selectedDate: Date;
};

export default function UploadClient({ selectedDate }: UploadClientProps) {
  const { toast } = useToast();
  const supabase = createClient();
  const [user, setUser] = useState<any | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [sleepScore, setSleepScore] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        // console.error("Error fetching user data:", error);
      } else {
        // console.log("Fetched user data:", user);
        setUser(user);
      }
    };

    fetchUser();
  }, [supabase.auth, toast]);
  const handleOpenDialog = () => {
    // Logic to handle dialog opening
    setShowDialog(true);
  };
  const handleCloseDialog = () => {
    setShowDialog(false);
    setImageFile(null);
  };

  const checkExistingUpload = async (userId: string, date: Date) => {
    // Format the date to YYYY-MM-DD
    const utcDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];

    console.log(
      `Checking for existing upload on ${utcDate} for user ${userId}`
    );

    try {
      let { data, error } = await supabase
        .from("sleepscores")
        .select("*")
        .eq("user_id", userId)
        .eq("selectedDate", utcDate);

      // console.log("Data returned:", data);
      // console.log("Error:", error);

      if (error) {
        console.error("Error checking existing upload:", error);
        throw error;
      }

      return data && data.length > 0;
    } catch (error) {
      console.error("Exception while checking existing upload:", error);
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

    if (sleepScore.trim() === "") {
      toast({
        variant: "destructive",
        title: "Please enter a sleep score before uploading",
      });
      return;
    }

    if (!imageFile) {
      toast({
        variant: "destructive",
        title: "Please attach an Image before uploading",
      });
      return;
    }

    try {
      const alreadyUploaded = await checkExistingUpload(user.id, selectedDate);
      if (alreadyUploaded) {
        toast({
          variant: "destructive",
          title: "Sleep data for this date has already been uploaded",
        });
        return;
      }

      setUploading(true);

      // Convert the selected date to UTC format
      const utcDate = new Date(
        Date.UTC(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate()
        )
      ).toISOString();

      // Upload image
      const fileExt = imageFile.name.split(".").pop();
      const filePath = `sleepscores/${utcDate}/${user.id}.${fileExt}`;
      let { error: uploadError } = await supabase.storage
        .from("sleepscores")
        .upload(filePath, imageFile);

      if (uploadError) {
        throw uploadError;
      }

      // Insert or update the sleep score record with the image URL or path
      const { error } = await supabase.from("sleepscores").insert({
        user_id: user.id,
        sleepScore: sleepScore,
        selectedDate: utcDate,
        imageUrl: filePath, // or construct the URL if needed
      });

      if (error) {
        throw error;
      }

      // console.log("Data and image uploaded successfully.");
      toast({
        variant: "default",
        title: "Data and image uploaded successfully",
      });
    } catch (error) {
      console.error("Exception in upload:", error);
      toast({ variant: "destructive", title: "Error in uploading data" });
    } finally {
      setUploading(false);
      handleCloseDialog();
    }
  };

  return (
    <>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" onClick={handleOpenDialog}>
            Upload
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Sleep Data</DialogTitle>
            <DialogDescription>
              Enter your sleep score for the selected date.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpload}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sleepScore" className="text-right">
                  Sleep Score
                </Label>
                <Input
                  id="sleepScore"
                  type="number"
                  min="0"
                  max="99"
                  value={sleepScore}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (
                      value === "" ||
                      (parseInt(value, 10) >= 0 && parseInt(value, 10) <= 99)
                    ) {
                      setSleepScore(value);
                    }
                  }}
                  className="col-span-3"
                />
                <Label htmlFor="imageFile" className="text-right">
                  Image Proof
                </Label>
                <Input
                  id="imageFile"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImageFile(file);
                    } else {
                      setImageFile(null);
                    }
                  }}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Upload</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
