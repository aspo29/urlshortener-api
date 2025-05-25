/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

interface LoginResponse {
  user: {
    id: number;
    username: string;
  };
  token: string;
}

// Optional: Define Visit types
interface Visit {
  id: number;
  urlId: number;
  visitedAt: string;
  // Add more fields based on your DB schema
}

const loginAndFetchData = async () => {
  try {
    // Step 1: Login
    const loginRes = await axios.post<LoginResponse>(
      "http://localhost:3000/auth/login",
      {
        username: "test3",
        password: "123456",
      }
    );

    const token = loginRes.data.token;
    console.log("✅ Logged in. JWT:", token);

    // Step 2: Fetch URLs
    // const urlsRes = await axios.get(
    //   "http://localhost:3000/urls?limit=5&offset=0",
    //   {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   }
    // );

    // const urls = urlsRes.data;
    // console.log("🔗 User URLs:", urls);

    // Step 3: Fetch recent visits for the user
    const visitsRes = await axios.get<Visit[]>(
      "http://localhost:3000/visits?limit=1&offset=0",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("📊 Recent Visits:", visitsRes.data);

    // Step 4: Fetch visits for a specific URL (optional)
    // if (urls.length > 0) {
    //   const urlId = urls[0].id;
    //   const specificVisitRes = await axios.get<Visit[]>(
    //     `http://localhost:3000/visits/${urlId}?limit=5&offset=0`,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     }
    //   );

    //   console.log(`📈 Visits for URL ID ${urlId}:`, specificVisitRes.data);
    // }
  } catch (error: any) {
    console.error("❌ Error during login or data fetching:", error.message);
  }
};

loginAndFetchData();
