import api from "./api";

export async function createDraftFromMemoImage(file, language) {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("language", language);

  const response = await api.post(
    "/api/work/draft/from-image",
    formData,
    {
      timeout: 300000,
    }
  );

  return response.data;
}
