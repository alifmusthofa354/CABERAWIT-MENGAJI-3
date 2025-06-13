import axios from "axios";

const API_URL = "/api/learning/classroom/people";
const API_URL_STUDENTS = "/api/learning/classroom/people/students";

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

export const PatchPeople = async (
  id_user_classroom: string,
  status: string,
  idPeopleUpdate: string
) => {
  try {
    const URL = `${API_URL}/${id_user_classroom}`;
    const response = await axios.patch(URL, {
      status: status,
      idPeopleUpdate: idPeopleUpdate,
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

export const fechingStudents = async (userID: string) => {
  try {
    const response = await axios.get(API_URL_STUDENTS, {
      params: { id: userID },
    });
    return response.data.students; // Asumsikan API mengembalikan { people: ... }
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

export const AddStudent = async (
  id_user_classroom: string,
  formData: FormData
) => {
  try {
    const URL = `${API_URL_STUDENTS}/${id_user_classroom}`;
    const response = await axios.post(URL, formData, {
      headers: { "Content-Type": "multipart/form-data" }, // Penting untuk mengirim file
    });
    return response.data.students;
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error)) {
      console.log("custom error axios : ", error);
      const message =
        error.response?.data?.details?.[0]?.message ||
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to Add Student. Please try again.";
      throw new Error(message);
    } else {
      throw new Error(
        "Unpected error, Failed to Add Student. Please try again."
      );
    }
  }
};

export const EditStudent = async (
  id_user_classroom: string,
  formData: FormData
) => {
  try {
    const URL = `${API_URL_STUDENTS}/${id_user_classroom}`;
    const response = await axios.patch(URL, formData, {
      headers: { "Content-Type": "multipart/form-data" }, // Penting untuk mengirim file
    });
    return response.data.students;
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error)) {
      console.log("custom error axios : ", error);
      const message =
        error.response?.data?.details?.[0]?.message ||
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to Update Student. Please try again.";
      throw new Error(message);
    } else {
      throw new Error(
        "Unpected error, Failed to Update Student. Please try again."
      );
    }
  }
};

export const PatchStudent = async (
  id_user_classroom: string,
  status: string,
  idStudentUpdate: string
) => {
  try {
    const URL = `${API_URL_STUDENTS}/status/${id_user_classroom}`;
    const response = await axios.patch(URL, {
      status: status,
      idStudentUpdate: idStudentUpdate,
    });
    return response.data.students;
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
