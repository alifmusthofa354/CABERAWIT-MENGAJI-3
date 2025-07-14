import axios from "axios";
export type Attendance = {
  id: string;
  name: string;
  status: "Hadir" | "Ijin" | "Alfa";
};

const API_URL = "/api/learning/attedance";

export const fechingAttedance = async (userID: string) => {
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
        "Failed to fetching attedance. Please try again.";
      throw new Error(message);
    } else {
      throw new Error(
        "Unpected error, Failed to fething attedance. Please try again."
      );
    }
  }
};

export const addAttedance = async (
  userID: string,
  schedule: string,
  attedance: Attendance[]
) => {
  try {
    const URL = `${API_URL}/${userID}`;
    const response = await axios.post(URL, {
      schedule: schedule,
      attedance: attedance,
    });
    console.log(response.data);
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


export const deleteAttedance = async (
  userID: string,
  idAttedance: string,
) => {
  try {
    const URL = `${API_URL}/${userID}`;
    const response = await axios.put(URL, {
      idAttedance: idAttedance,
    });
    console.log(response.data);
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


export const updateAbsensi = async (
  userID: string,
  idAbsensi: string,
  Status:number,
) => {
  try {
    const URL = `${API_URL}/${userID}/Absensi/${idAbsensi}`;
    const response = await axios.patch(URL, {
      Status: Status,
    });
    console.log(response.data);
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
