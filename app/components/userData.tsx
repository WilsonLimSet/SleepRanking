"use server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export const getUserData = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  let userData = null;
  
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      userData = user;
    }
  } catch (error) {
    console.error("Error fetching user:", error);
  }

  return { props: { userData} };
};
