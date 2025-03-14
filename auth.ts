import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { supabase } from "@/lib/supabase";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}/dashboard`;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        // Cek jika user sudah ada di database Supabase
        const { data: existingUser, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", user.email)
          .single();

        if (error || !existingUser) {
          // Jika user tidak ada, tambahkan ke database dan set role
          const { error: insertError } = await supabase.from("users").insert({
            email: user.email, // Role default untuk pengguna baru
          });

          if (insertError) {
            console.error("Error inserting user:", insertError);
            return false; // Return false agar sign-in gagal
          }
        }
      }
      return true;
    },
  },
});
