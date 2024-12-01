import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = 'https://jenishagame.pythonanywhere.com/'; // Replace with your actual backend URL

export const apiService = {
  submitScore: async (playerData) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(
        `${BASE_URL}/api/game/submit-score/`,
        playerData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to the Authorization header
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error submitting score:', error);
      throw error;
    }
  },

  getTopScores: async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${BASE_URL}/api/game/user-scores/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("response",response.data)
      return response.data;
    } catch (error) {
      console.error('Error fetching top scores:', error);
      throw error;
    }
  },

getUserScores: async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${BASE_URL}/api/game/my-scores/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user scores:', error);
      throw error;
    }
  }
};


// Function to handle user registration
export const registerUser = async (username, email, password, confirmPassword) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/register/`, {
      username,
      email,
      password,
      confirm_password: confirmPassword,
    });
    return response.data;
  } catch (error) {
    console.error('Error during registration:', error.message);
    const errorMessage =
      error.response && error.response.data
        ? error.response.data
        : { detail: 'An unexpected error occurred.' };
    throw errorMessage;
  }
};


// Function to handle user login


export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/login/`, {
      username,
      password,
    });
    // const token = response.data.access; // Assuming the response contains the JWT token
    // await AsyncStorage.setItem('userToken', token);
    return response.data;
  } catch (error) {
    console.error('Error during login:', error.response.data);
    throw error.response.data;
  }
};

