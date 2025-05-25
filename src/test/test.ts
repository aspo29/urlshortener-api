/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
//npx ts-node test.ts
interface UserResponse {
  user: {
    id: number;
    username: string;
  };
  token: string;
}

const registerUser = async () => {
  try {
    const response = await axios.post("http://localhost:3000/auth/register", {
      username: "test1",
      password: "12345678",
    });
    console.log("Registered:", response.data);
  } catch (error: any) {
    console.error(
      " Registration failed:",
      error.response?.data || error.message
    );
  }
};

const loginUser = async () => {
  try {
    const response = await axios.post<UserResponse>(
      "http://localhost:3000/auth/login",
      {
        username: "test1",
        password: "12345678",
      }
    );
    console.log("Logged in:", response.data);
  } catch (error: any) {
    console.error("Login failed:", error.response?.data || error.message);
  }
};

const run = async () => {
  await registerUser();
  await loginUser();
};

run();
