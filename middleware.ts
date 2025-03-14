export { auth as middleware } from "@/auth";

export const config = {
  // Hanya terapkan middleware untuk halaman dashboard dan sub kelasnya
  matcher: ["/dashboard/:path*"],
};
