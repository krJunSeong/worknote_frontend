import api from "./api";

export const generateAiReport = async (language = "ko") => {
  const response = await api.post("/api/reports/ai", null, {
    params: { language },
  });

  return response.data;
};

export const downloadAiReportPdf = async (report) => {
  return api.post("/api/reports/ai/pdf", report, {
    responseType: "blob",
    headers: {
      Accept: "application/pdf",
    },
  });
};
