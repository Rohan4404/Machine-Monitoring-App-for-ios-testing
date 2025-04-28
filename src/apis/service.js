import axios from "axios";
import { apiURL } from "./client";

// registerUser function
export const registerUser = async (userData) => {
  try {
    console.log("Sending payload to API:", userData);
    const response = await axios.post(`${apiURL}/register`, userData);
    console.log("Received response:", response.data);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    return error.response?.data || { error: "Something went wrong" };
  }
};

//   login function
export const loginUser = async (userData) => {
  try {
    console.log("Sending payload to API:", userData);
    const response = await axios.post(`${apiURL}/login`, userData, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("Received response:", response.data);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    return error.response?.data || { error: "Something went wrong" };
  }
};

// Send password reset email
export const sendPasswordReset = async (userData) => {
  try {
    const response = await axios.post(`${apiURL}/forgot-password`, userData);
    return response.data;
  } catch (error) {
    return error.response?.data || { error: "Something went wrong" };
  }
};

// Resets the password using token
export const resetUserPassword = async (token, data) => {
  try {
    const response = await axios.post(
      `${apiURL}/reset-password/${token}`,
      data
    );
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || "Something went wrong" };
  }
};

// getCardData function
export const getCardData = async () => {
  try {
    const response = await axios.get(`${apiURL}/getcardData`);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    return error.response?.data || { error: "Something went wrong" };
  }
};

//storecardApi
export const storeCardData = async (cardData) => {
  try {
    console.log("Sending payload to API:", cardData);
    const response = await axios.post(`${apiURL}/storecardData`, cardData);
    console.log("Received response:", response.data);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    return error.response?.data || { error: "Something went wrong" };
  }
};

//DeletecardApi
export const deleteCardData = async (cardId) => {
  try {
    console.log("Sending payload to API:", cardId);
    const response = await axios.delete(`${apiURL}/deletecardData`, {
      data: { id: cardId },
    });
    console.log("Received response:", response.data);
    return response.data;
  } catch (error) {
    console.error("API Error:", error); //
    return error.response?.data || { error: "Something went wrong" };
  }
};
