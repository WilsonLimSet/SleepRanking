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
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) {
                console.error("Error fetching user data:", error);
                toast({ variant: "destructive", title: "Error fetching user data" });
            } else {
                console.log("Fetched user data:", user);
                setUser(user);
            }
        };

        fetchUser();
    }, [supabase.auth, toast]);

    const handleUpload = async (event: React.FormEvent) => {
        event.preventDefault();
    
        if (!user) {
            console.log("Upload attempt without user session.");
            toast({
                variant: "destructive",
                title: "You Must Sign In to Upload Sleep Data",
            });
            return;
        }
    
        // Convert the selected date to UTC
        const utcDate = new Date(Date.UTC(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()));
    
        try {
            const { error } = await supabase
                .from("sleepscores")
                .insert({ user_id: user.id, sleepScore: "88", selectedDate: utcDate });
    
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
    };
    

    return (
        <div className="flex items-center gap-4">
            <form onSubmit={handleUpload}>
                <Button variant="outline">Upload</Button>
            </form>
        </div>
    );
}
