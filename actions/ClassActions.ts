import axios from "axios";

const API_URL = "/api/learning/classroom"; // Ganti dengan URL API yang sesuai
const API_URL_GeneralClass = "/api/learning/classroom/generalclass";

export const fetchClasses = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.classes; // Asumsikan API mengembalikan { classes: ... }
  } catch (error) {
    // Cek apakah error adalah instance dari Error dan apakah error memiliki properti response
    if (axios.isAxiosError(error)) {
      // Jika error adalah AxiosError, kita bisa mengakses error.response
      console.log(error.response?.data.message);
      throw new Error(error.response?.data.message || "Error fetching classes");
    } else if (error instanceof Error) {
      // Jika error adalah instance dari Error biasa, kita bisa mengakses error.message
      console.error("Error fetching list:", error.message);
      throw error;
    } else {
      // Jika error bukan instance dari Error atau AxiosError, tangani dengan pesan generik
      console.error("An unknown error occurred while fetching classes.");
      throw new Error("An unknown error occurred while fetching classes.");
    }
  }
};

export const fetchUserClass = async (id_user_classroom: string) => {
  try {
    console.log("fetching data : ", id_user_classroom);
    const response = await axios.get(API_URL_GeneralClass, {
      params: { id: id_user_classroom },
    });
    return response.data.classes; // Asumsikan API mengembalikan { classes: ... }
  } catch (error) {
    console.error("ada error : ", error);

    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status;
      const errorMessage =
        error.response?.data?.message ||
        "Terjadi kesalahan saat mengambil kelas.";

      if (statusCode === 404) {
        // --- Penanganan spesifik untuk 404 Not Found ---
        console.error("Error 404: Kelas tidak ditemukan.", errorMessage);
        throw new Error("Kelas tidak ditemukan. Pastikan ID kelas benar.");
      } else if (statusCode === 500) {
        // --- Penanganan spesifik untuk 500 Internal Server Error ---
        console.error("Error 500: Kesalahan server internal.", errorMessage);
        throw new Error(
          "Terjadi masalah pada server. Silakan coba lagi nanti."
        );
      } else if (statusCode) {
        // --- Penanganan untuk kode status HTTP lainnya ---
        console.error(`Error ${statusCode}:`, errorMessage);
        throw new Error(`Kesalahan API (${statusCode}): ${errorMessage}`);
      } else {
        // --- Penanganan jika tidak ada kode status (misalnya, masalah jaringan) ---
        console.error("Kesalahan jaringan atau permintaan dibatalkan.");
        throw new Error(
          "Tidak dapat terhubung ke server. Periksa koneksi internet Anda."
        );
      }
    } else if (error instanceof Error) {
      // --- Penanganan untuk error JavaScript biasa (misalnya, kesalahan kode di sisi klien) ---
      console.error("Kesalahan tak terduga:", error.message);
      throw new Error(`Terjadi kesalahan tak terduga: ${error.message}`);
    } else {
      // --- Penanganan untuk error yang tidak dikenal ---
      console.error("Terjadi kesalahan yang tidak diketahui.");
      throw new Error("Terjadi kesalahan yang tidak diketahui.");
    }
  }
};
