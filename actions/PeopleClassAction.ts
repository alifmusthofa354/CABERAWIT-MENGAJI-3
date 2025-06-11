import axios from "axios";

const API_URL = "/api/learning/classroom/people"; // Ganti dengan URL API yang sesuai

export const fechingPeople = async (userID: string) => {
  try {
    const response = await axios.get(API_URL, {
      params: { id: userID },
    });
    return response.data.people; // Asumsikan API mengembalikan { people: ... }
  } catch (error) {
    // Cek apakah error adalah instance dari Error dan apakah error memiliki properti response
    if (axios.isAxiosError(error)) {
      // Jika error adalah AxiosError, kita bisa mengakses error.response
      console.log(error.response?.data.message);
      throw new Error(error.response?.data.message || "Error fetching people");
    } else if (error instanceof Error) {
      // Jika error adalah instance dari Error biasa, kita bisa mengakses error.message
      console.error("Error fetching people:", error.message);
      throw error;
    } else {
      // Jika error bukan instance dari Error atau AxiosError, tangani dengan pesan generik
      console.error("An unknown error occurred while fetching people.");
      throw new Error("An unknown error occurred while fetching people.");
    }
  }
};
