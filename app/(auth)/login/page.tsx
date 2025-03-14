import { signIn } from "@/auth";
import Image from "next/image";

export default function SignIn() {
  return (
    <>
      <div className="p-6 flex items-center justify-center min-h-screen bg-gray-50 ">
        <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Login to Caberawit Mengaji
            </h2>
            <p className="text-gray-600">Please login to your account</p>
          </div>

          {/* Social Buttons */}
          <form
            action={async () => {
              "use server";
              await signIn("google");
            }}
          >
            <div className="space-y-4 mb-6">
              <button
                type="submit"
                className="flex items-center justify-center w-full px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <Image
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  width={20} // Tentukan ukuran yang konsisten
                  height={20} // Tentukan ukuran yang konsisten
                  className="mr-2"
                />
                Continue with Google
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
