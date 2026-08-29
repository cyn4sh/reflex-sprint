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

// Dispatcher: get all deliveries, optional status filter
export const getDispatcherDeliveries = async (status) => {
  const response = await api.get("/dispatcher/deliveries/", {
    params: status ? { status } : {},
  });
  return response.data;
};

// Dispatcher: assign a rider to a delivery
export const assignDelivery = async (id, riderId) => {
  const response = await api.post(
    `/dispatcher/deliveries/${id}/assign/`,
    { rider: riderId }
  );
  return response.data;
};

// Rider: get deliveries assigned to self
export const getRiderDeliveries = async () => {
  const response = await api.get("/rider/deliveries/");
  return response.data;
};

// Rider: mark as picked up
export const pickUpDelivery = async (id) => {
  const response = await api.post(`/rider/deliveries/${id}/pick_up/`);
  return response.data;
};

// Rider: confirm delivery via scanned code
export const confirmDelivery = async (id, confirmationCode) => {
  const response = await api.post(`/rider/deliveries/${id}/confirm/`, {
    confirmation_code: confirmationCode,
  });
  return response.data;
};