// getUserData.js
"use server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export const getUserData = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user;  // directly return the user object
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
