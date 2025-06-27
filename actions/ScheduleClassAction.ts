import axios from "axios";

const API_URL = "/api/learning/classroom/schedule";

export const fetchingSchedule = async (userID: string) => {
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

export const addSchedule = async (userID: string, name: string) => {
  try {
    const URL = `${API_URL}/${userID}`;
    const response = await axios.post(URL, { name: name });
    return response.data;
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error)) {
      console.log("custom error axios : ", error);
      const message =
        error.response?.data?.details?.[0]?.message ||
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed schdeule. Please try again.";
      throw new Error(message);
    } else {
      throw new Error("Unpected error, Add schdeule. Please try again.");
    }
  }
};

export const patchSchedule = async (
  userID: string,
  name: string,
  idScheduleUpdate: string
) => {
  try {
    const URL = `${API_URL}/${userID}`;
    const response = await axios.patch(URL, {
      name,
      idScheduleUpdate,
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
        "Failed schdeule. Please try again.";
      throw new Error(message);
    } else {
      throw new Error("Unpected error, Update schdeule. Please try again.");
    }
  }
};

export const deleteSchedule = async (userID: string, idSchedule: string) => {
  try {
    const URL = `${API_URL}/${userID}`;
    const response = await axios.delete(URL, { data: { idSchedule } });
    return response.data;
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error)) {
      console.log("custom error axios : ", error);
      const message =
        error.response?.data?.details?.[0]?.message ||
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to Delete schedule. Please try again.";
      throw new Error(message);
    } else {
      throw new Error("Unpected error, Delete schedule. Please try again.");
    }
  }
};
