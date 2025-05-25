import axios from "axios";
//remember the token for later use? You can save it to a .env file or local JSON file.
const BASE_URL = "http://localhost:3000";
const USERNAME = "test3";
const PASSWORD = "123456";

let token = "";

const login = async () => {
  const res = await axios.post(`${BASE_URL}/auth/login`, {
    username: USERNAME,
    password: PASSWORD,
  });
  token = res.data.token;
  console.log("JWT token:", token);

  console.log("Logged in:", res.data.user.username);
};

const createUrl = async (): Promise<string> => {
  const res = await axios.post(
    `${BASE_URL}/urls`,
    {
      url: "https://errre.com",
      id: "nono12", // Custom ID, must be unique
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log("🔗 URL created:", res.data);
  // Return the id of the created URL (use the custom id or the one returned by the API)
  return res.data.id;
};

const updateUrl = async (id: string) => {
  const res = await axios.put(
    `${BASE_URL}/urls/${id}`,
    {
      url: "https://newurl.com",
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log("URL updated:", res.data);
};

const deleteUrl = async (id: string) => {
  const res = await axios.delete(`${BASE_URL}/urls/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("URL deleted:", res.data);
};

const getUrls = async () => {
  const res = await axios.get(`${BASE_URL}/urls?limit=5&offset=0`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("User URLs:", res.data);
};

const testUrls = async () => {
  await login();
  const id = await createUrl();
  await updateUrl(id);
  await getUrls();
  await deleteUrl(id);
};
  

testUrls();
