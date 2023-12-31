"use client";
import { Button } from "@/components/ui/button";
import { getLoggedIn } from "./getLoggedIn";
import { useToast } from "@/components/ui/use-toast";

export default function UploadClient() {
  const { toast } = useToast();

  const handleUpload = async (event:any) => {
    event.preventDefault();
    const result = await getLoggedIn();
    console.log(result);
    if (!result.props.userLoggedIn) {
      toast({ 
        variant: "destructive",title: "You Must Sign In to Upload Sleep Data" });
    } else {
      toast({  variant: "destructive",title: "Event start time cannot be earlier than 8am" });
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
