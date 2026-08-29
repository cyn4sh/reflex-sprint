import api from "./api";

// Dispatcher: get list of riders for assignment dropdown
export const getRiders = async () => {
  const response = await api.get("/users/", {
    params: { role: "rider" },
  });
  return response.data;
};