import axios from "axios";

const API_URL = "/api/learning/classroom/people"; // Ganti dengan URL API yang sesuai

export const fechingPeople = async (userID: string) => {
  try {
    const response = await axios.get(API_URL, {
      params: { id: userID },
    });
    return response.data.people; // Asumsikan API mengembalikan { people: ... }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.details?.[0]?.message ||
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to fetching people. Please try again.";
      throw new Error(message);
    } else {
      throw new Error(
        "Unpected error, Failed to fething people. Please try again."
      );
    }
  }
};
