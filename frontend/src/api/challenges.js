import client from "./client";

export const listChallenges = () => client.get("/challenges/");

export const getChallenge = (id) => client.get(`/challenges/${id}`);

export const createChallenge = (data) => client.post("/challenges/", data);

export const submitChallenge = (challengeId, data) =>
  client.post(`/challenges/${challengeId}/submit`, data);
