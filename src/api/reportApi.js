import api from "./api";

export const generateAiReport = async (
  language = "ko"
) => {
  const normalizedLanguage =
    language === "ja" ? "ja" : "ko";

  const response = await api.post(
    "/api/reports/ai",
    null,
    {
      params: {
        language: normalizedLanguage,
      },
    }
  );

  return response.data;
};

export const downloadAiReportPdf = async (
  report
) => {
  if (!report) {
    throw new Error(
      "PDF로 변환할 보고서가 없습니다."
    );
  }

  const response = await api.post(
    "/api/reports/ai/pdf",
    report,
    {
      responseType: "blob",
      headers: {
        Accept: "application/pdf",
      },
    }
  );

  return response;
};