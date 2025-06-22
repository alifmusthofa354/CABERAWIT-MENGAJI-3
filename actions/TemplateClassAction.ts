import axios from "axios";

const API_URL = "/api/learning/classroom/templateclass";

export const fechingTemplate = async (userID: string) => {
  try {
    const response = await axios.get(API_URL, {
      params: { id: userID },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.details?.[0]?.message ||
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to fetching template. Please try again.";
      throw new Error(message);
    } else {
      throw new Error(
        "Unpected error, Failed to fething template. Please try again."
      );
    }
  }
};

export const patchTemplate = async (userID: string, content: string) => {
  try {
    const URL = `${API_URL}/${userID}`;
    const response = await axios.patch(URL, {
      content: content,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error)) {
      console.log("custom error axios : ", error);
      const message =
        error.response?.data?.details?.[0]?.message ||
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to Update people. Please try again.";
      throw new Error(message);
    } else {
      throw new Error(
        "Unpected error, Update to update people. Please try again."
      );
    }
  }
};

export const addTemplate = async (userID: string) => {
  try {
    const URL = `${API_URL}/${userID}`;
    const response = await axios.post(URL);
    return response.data;
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error)) {
      console.log("custom error axios : ", error);
      const message =
        error.response?.data?.details?.[0]?.message ||
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to Update people. Please try again.";
      throw new Error(message);
    } else {
      throw new Error(
        "Unpected error, Update to update people. Please try again."
      );
    }
  }
};
