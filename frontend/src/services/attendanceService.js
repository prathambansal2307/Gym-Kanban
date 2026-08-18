import api from "./api";

export const getAttendance = async (date, session) => {
  const params = date && session ? { date, session } : {};
  const response = await api.get("/attendance", { params });
  return response.data;
};

export const bulkMarkAttendance = async (date, session, subscriberIds) => {
  const response = await api.post("/attendance/bulk", {
    date,
    session,
    subscriberIds,
  });
  return response.data;
};

export const deleteAttendance = async (id) => {
  const response = await api.delete(`/attendance/${id}`);
  return response.data;
};