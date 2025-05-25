import axios from "axios";

interface LoginResponse {
  user: {
    id: number;
    username: string;
  };
  token: string;
}

const loginAndFetchUrls = async () => {
  try {
    // Step 1: Login and get JWT
    const loginRes = await axios.post<LoginResponse>(
      "http://localhost:3000/auth/login",
      {
        username: "test1",
        password: "12345678",
      }
    );

    const token = loginRes.data.token;
    console.log("Logged in. JWT:", token);

    // Step 2: Use JWT to fetch protected data
    const urlsRes = await axios.get(
      "http://localhost:3000/urls?limit=5&offset=0",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("🔗 User URLs:", urlsRes.data);

    // Step 3: Optionally, you can create, update, or delete URLs
    const urlsResp = await axios.post(
      "http://localhost:3000/urls",
      { url: "https://chatgpt.com/" },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("🔗 URL created:", urlsResp.data);    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error during login or fetching URLs or Token:", error.message);
  }
};

loginAndFetchUrls();
