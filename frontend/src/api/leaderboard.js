import client from "./client";

export const globalLeaderboard = (params) =>
  client.get("/leaderboard/", { params });

export const neighborhoodLeaderboard = (neighborhood, params) =>
  client.get(`/leaderboard/neighborhood/${neighborhood}`, { params });
