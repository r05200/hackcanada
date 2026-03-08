import client from "./client";

export const getProfile = () => client.get("/users/me");

export const getUser = (id) => client.get(`/users/${id}`);

export const getBadges = () => client.get("/users/me/badges");
