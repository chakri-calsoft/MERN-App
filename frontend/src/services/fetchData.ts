import axios from "axios";

const getInfo = async (token: string) => {
  const response = await axios.get("...", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response;
};

export default getInfo;
