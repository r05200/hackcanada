import client from "./client";

export const submitReport = (data) => client.post("/reports/", data);
