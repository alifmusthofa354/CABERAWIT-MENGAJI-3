// Contoh di halaman utama
"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import Logout from "./Logout";
export default function Component() {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return (
      <>
        <p>sedang loading...</p>
      </>
    );
  }
  if (session) {
    return (
      <>
        Signed in as {session.user?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
        <br />
        <button onClick={() => signIn()}>Sign in</button>
      </>
    );
  }
  return (
    <>
      <Logout />
    </>
  );
}
