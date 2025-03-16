import axios from "axios";

const API_URL = "/api/learning/classroom"; // Ganti dengan URL API yang sesuai

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
