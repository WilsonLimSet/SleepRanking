"use server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export const getLoggedIn = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  let userLoggedIn = false;

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      userLoggedIn = true;
    }
  } catch (error) {
    console.error("Error fetching user:", error);
  }

  return { props: { userLoggedIn } };
};
