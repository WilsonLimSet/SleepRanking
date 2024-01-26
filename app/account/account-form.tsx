"use client";

// Define the structure of your 'profiles' table
interface Profile {
  id: string;
  full_name: string | null;
  website: string | null;
  avatar_url: string | null;
  country: string | null;
  sleep_tracker: string | null;
  // Add other fields from your profiles table if needed
}

// Define the database structure
interface Database {
  profiles: Profile;
}
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Avatar from "./avatar";
// import { Database } from "../database.types";
import {
  Session,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import CountrySelector from "../components/selector";
import { COUNTRIES } from "../lib/countries";
import { SelectMenuOption } from "../lib/types";
export default function AccountForm({ session }: { session: Session | null }) {
  // Create a Supabase client with the correct type
  const supabase = createClientComponentClient<Database>();

  // Component state definitions
  const [loading, setLoading] = useState(true);
  const [fullname, setFullname] = useState<string | null>(null);
  const [sleep_tracker, setSleepTracker] = useState("");
  const [website, setWebsite] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [country, setCountry] = useState<SelectMenuOption["value"]>("US");

  const [showSyncOuraButton, setShowSyncOuraButton] = useState(false);

  const handleSelectSleepTracker = (value: string) => {
   
    setSleepTracker(value);
    setShowSyncOuraButton(value === "Oura Ring");
  };

  

  

  // Extract user from session
  const user = session?.user;
  const handleSyncOuraRing = () => {
    // Redirect to Oura Ring OAuth URL
    window.location.href =  "https://cloud.ouraring.com/oauth/authorize?client_id=TAETWHK7S2EU45NG&scope=email+daily&redirect_uri=https%3A%2F%2Fwww.sleepranking.com%2Fapi%2Foura&responstype=code";                                                                                                                                                     
                  
  };

  // Fetch user profile data
  const getProfile = useCallback(async () => {
    try {
      setLoading(true);
      let { data, error, status } = await supabase
        .from("profiles")
        .select(`full_name, website, avatar_url, sleep_tracker, country`)
        .eq("id", user?.id ?? "")
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setFullname(data.full_name);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
        setCountry(data.country as SelectMenuOption["value"] || "US");
        setSleepTracker(data.sleep_tracker);
      }
    } catch (error) {
      alert("Error loading user data!");
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  // Load profile data on component mount
  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  // Update profile data
  async function updateProfile({
    fullname,
    website,
    avatar_url,
    country,
    sleep_tracker,
  }: {
    fullname: string | null;
    website: string | null;
    avatar_url: string | null;
    country: string | null;
    sleep_tracker: string | null;
  }) {
    try {
      setLoading(true);

      let { error } = await supabase.from("profiles").upsert({
        id: user?.id as string,
        full_name: fullname,
        website,
        avatar_url,
        country,
        sleep_tracker,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        throw error;
      }
      alert("Profile updated!");
    } catch (error) {
      alert("Error updating the data!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-8 mb-4 ">
      <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{" "}
        Back
      </Link>
      <div className="flex flex-col items-center space-y-4">
        <Avatar
           uid={user ? user.id : ''}
          url={avatar_url}
          size={100}
          onUpload={(url) => {
            setAvatarUrl(url);
          }}
        />
      </div>
      <div className="space-y-1 py-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          id="email"
          type="text"
          value={session?.user.email}
          disabled
          className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div className="space-y-2 py-2">
        <label className="block text-sm font-medium text-gray-700">
          Select a country
        </label>
        <CountrySelector
          id={"country-selector"}
          open={isOpen}
          onToggle={() => setIsOpen(!isOpen)}
          onChange={setCountry}
          selectedValue={
            COUNTRIES.find((option) => option.value === country) || {
              title: "United States",
              value: "US",
            }
          }
        />
      </div>

      <div className="space-y-2 py-2">
        <label
          htmlFor="fullName"
          className="text-sm font-semibold text-gray-700"
        >
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          placeholder="Enter your full name"
          value={fullname || ""}
          onChange={(e) => setFullname(e.target.value)}
          className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2 py-2">
        <label
          htmlFor="sleepTracker"
          className="text-sm font-semibold text-gray-700"
        >
          Sleep Tracker
        </label>
        <Select value={sleep_tracker} onValueChange={handleSelectSleepTracker}>
          <SelectTrigger>
            <SelectValue placeholder="Select a sleep tracker" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Oura Ring">Oura Ring</SelectItem>
              <SelectItem value="Whoop">Whoop</SelectItem>
              <SelectItem value="Apple Watch">Apple Watch</SelectItem>
              <SelectItem value="Fitbit">Fitbit</SelectItem>
              <SelectItem value="Others">Others</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

       {/* Conditional rendering of the Sync Oura Ring button */}
       {showSyncOuraButton && (
        <div className="space-y-1 py-2">
          <button
            className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-sm text-sm font-medium"
            onClick={handleSyncOuraRing}
          >
            Sync Oura Ring
          </button>
        </div>
      )}

      <div className="space-y-1 py-2">
        <label
          htmlFor="website"
          className="text-sm font-semibold text-gray-700"
        >
          Website
        </label>
        <input
          id="website"
          type="url"
          placeholder="https://yourwebsite.com"
          value={website || ""}
          onChange={(e) => setWebsite(e.target.value)}
          className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div className="space-y-1 py-2">
        <button
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm text-sm font-medium"
          onClick={() =>
            updateProfile({
              fullname,
              website,
              avatar_url,
              country,
              sleep_tracker,
            })
          }
          disabled={loading}
        >
          {loading ? "Loading ..." : "Update"}
        </button>
      </div>

      <div className="space-y-1 py-2">
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md shadow-sm text-sm font-medium"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
