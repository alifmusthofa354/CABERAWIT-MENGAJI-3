import axios from "axios";

const API_URL = "/api/learning/attedance/history";

export const fechingHistoryDay = async (userID: string) => {
  const URL = `${API_URL}/day`;
  try {
    const response = await axios.get(URL, {
      params: { id: userID },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.details?.[0]?.message ||
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to fetching attedance. Please try again.";
      throw new Error(message);
    } else {
      throw new Error(
        "Unpected error, Failed to fething attedance. Please try again."
      );
    }
  }
};
