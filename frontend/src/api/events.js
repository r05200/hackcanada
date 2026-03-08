import client from "./client";

export const listEvents = (params) => client.get("/events/", { params });

export const getEvent = (id) => client.get(`/events/${id}`);

export const createEvent = (data) => client.post("/events/", data);

export const checkinEvent = (eventId) =>
  client.post(`/events/${eventId}/checkin`);
