// api.ts
import axios from "axios";

const API_URL = "/api/learning/classroom"; // Sesuaikan dengan path API Anda

export const fetchClasses = async () => {
  const response = await axios.get(API_URL);
  return response.data.classes; // Asumsikan API mengembalikan { classes: ... }
};
