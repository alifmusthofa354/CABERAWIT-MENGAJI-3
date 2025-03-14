// app/auth/signout/page.tsx
"use client";

import { signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const SignOut = () => {
  const router = useRouter();

  useEffect(() => {
    // Log out secara otomatis dan redirect setelah logout
    signOut({ redirect: false }).then(() => {
      // Anda bisa melakukan pengalihan manual ke halaman tertentu setelah logout
      router.push("/loginnextauth");
    });
  }, [router]);

  return (
    <div>
      <h1>Logging you out...</h1>
    </div>
  );
};

export default SignOut;
