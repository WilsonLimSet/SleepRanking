import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AuthForm() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const goProfile = async () => {
    "use server";

    return redirect("/account");
  };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const signOut = async () => {
    "use server";

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    await supabase.auth.signOut();
    return redirect("/login");
  };

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.email}!
      <form action={goProfile}>
        <button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
          Profile
        </button>
      </form>
    </div>
  ) : (
    <Link
      href="/login"
      className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
    >
      Sign Up/Login
    </Link>
  );
}

// import { useState, useEffect } from 'react';
// import { createClient } from "@/utils/supabase/server";
// import Link from "next/link";
// import { cookies } from "next/headers";
// import { useRouter } from 'next/router';

// export default function AuthForm() {
//   const [user, setUser] = useState(null);
//   const router = useRouter();
//   const cookieStore = cookies();
//   const supabase = createClient(cookieStore);

//   useEffect(() => {
//     const fetchUser = async () => {
//       const { data: { user } } = await supabase.auth.getUser();
//       setUser(user);
//     };

//     fetchUser();
//   }, []);

//   const signOut = async () => {
//     await supabase.auth.signOut();
//     router.push("/login");
//   };

//   const goToProfile = () => {
//     router.push("/account");
//   };

//   return user ? (
//     <div className="flex items-center gap-4">
//       Hey, {user.email}!
//       <button onClick={goToProfile} className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
//         Profile
//       </button>
//       <button onClick={signOut} className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
//         Sign Out
//       </button>
//     </div>
//   ) : (
//     <Link
//       href="/login"
//       className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
//     >
//       Sign Up/Login
//     </Link>
//   );
// }
