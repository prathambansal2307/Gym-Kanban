import api from "./api";

export const getSubscribers = async () => {
  const response = await api.get("/subscribers");
  return response.data;
};

export const createSubscriber = async (subscriberData) => {
  const response = await api.post("/subscribers", subscriberData);
  return response.data;
};

export const updateSubscriberStatus = async (id, status) => {
  const response = await api.patch(`/subscribers/${id}/status`, { status });
  return response.data;
};

export const deleteSubscriber = async (id) => {
  const response = await api.delete(`/subscribers/${id}`);
  return response.data;
};