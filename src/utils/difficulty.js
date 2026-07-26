export const normalizeDifficulty = (difficulty) => {
  if (!difficulty || typeof difficulty !== "string") {
    return "미분류";
  }

  const normalized = difficulty.trim();

  if (
    normalized.includes("초급") ||
    normalized.includes("初級") ||
    normalized.toLowerCase().includes("beginner")
  ) {
    return "초급";
  }

  if (
    normalized.includes("중급") ||
    normalized.includes("中級") ||
    normalized.toLowerCase().includes("intermediate")
  ) {
    return "중급";
  }

  if (
    normalized.includes("고급") ||
    normalized.includes("上級") ||
    normalized.toLowerCase().includes("advanced")
  ) {
    return "고급";
  }

  return "미분류";
};

export const translateDifficulty = (difficulty, t) => {
  const normalized = normalizeDifficulty(difficulty);

  switch (normalized) {
    case "초급":
      return t("difficulty.beginner");

    case "중급":
      return t("difficulty.intermediate");

    case "고급":
      return t("difficulty.advanced");

    default:
      return t("difficulty.unclassified");
  }
};

export const getDifficultyClassName = (difficulty) => {
  const normalized = normalizeDifficulty(difficulty);

  switch (normalized) {
    case "초급":
      return "beginner";

    case "중급":
      return "intermediate";

    case "고급":
      return "advanced";

    default:
      return "unclassified";
  }
};