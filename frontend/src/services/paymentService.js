import api from "./api";

export const getPayments = async () => {
  const response = await api.get("/payments");
  return response.data;
};

export const createPayment = async (paymentData) => {
  const response = await api.post("/payments", paymentData);
  return response.data;
};

export const deletePayment = async (id) => {
  const response = await api.delete(`/payments/${id}`);
  return response.data;
};