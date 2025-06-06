import axios from "axios";

const API_URL_GeneralClass = "/api/learning/classroom/generalclass";
const API_URL_GeneralClass_Status =
  "/api/learning/classroom/generalclass/status";

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

export const changeStatusClass = async (
  id_user_classroom: string,
  status: string
) => {
  try {
    console.log("class id : ", id_user_classroom);
    console.log("change status : ", status);
    const URL = `${API_URL_GeneralClass_Status}/${id_user_classroom}`;
    const response = await axios.patch(URL, {
      status: status,
    });
    return response.data;
  } catch (error) {
    // Penanganan error yang lebih baik dari respons Axios
    const errorMessage =
      //   error.response?.data?.error || // Ambil pesan error dari backend jika ada
      //   error.message || // Pesan error standar Axios
      "Failed to change class status. Please try again.";

    console.error("Error changing class status:", error);
    throw new Error(errorMessage); // Lempar error dengan pesan yang lebih informatif
  }
};
