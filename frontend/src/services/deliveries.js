import api from "./api";

// Get deliveries
export const getDeliveries = async () => {
  const response = await api.get("/deliveries/");
  return response.data;
};

// Get a single delivery
export const getDelivery = async (id) => {
  const response = await api.get(`/deliveries/${id}/`);
  return response.data;
};

// Create a delivery
export const createDelivery = async (deliveryData) => {
  const response = await api.post("/deliveries/", deliveryData);
  return response.data;
};

// Update a delivery
export const updateDelivery = async (id, deliveryData) => {
  const response = await api.patch(
    `/deliveries/${id}/`,
    deliveryData
  );

  return response.data;
};

// Delete a delivery
export const deleteDelivery = async (id) => {
  const response = await api.delete(`/deliveries/${id}/`);
  return response.data;
};