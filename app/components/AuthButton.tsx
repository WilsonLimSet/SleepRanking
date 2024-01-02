"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client"; // Assuming this is the correct path for client-side usage
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AuthButton() {
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
  }, [supabase.auth]);

  return user ? (
    <div className="flex items-center gap-4">
      <Link href="/account" passHref>
        <Button>Profile</Button>
      </Link>
    </div>
  ) : (
    <div className="flex items-center gap-4">
      <Link href="/login" passHref>
        <Button>Login/Sign Up</Button>
      </Link>
    </div>
  );
}
