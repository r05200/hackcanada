import client from "./client";

export const submitReport = (data) => client.post("/reports/", data);

export const analyzeImage = (file) => {
  const formData = new FormData();
  formData.append("image", file);
  return client.post("/ai/analyze", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
