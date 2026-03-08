import client from "./client";

export const getProfile = () => client.get("/users/me");

export const getUser = (id) => client.get(`/users/${id}`);

export const getBadges = () => client.get("/users/me/badges");

export const awardXp = (xp) => client.post("/users/me/award-xp", { xp });

export const acceptChallenge = (ch) => client.post("/users/me/accept-challenge", ch);

export const completeChallenge = (ch) => client.post("/users/me/complete-challenge", ch);
