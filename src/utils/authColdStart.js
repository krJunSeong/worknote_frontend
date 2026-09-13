export const AUTH_LOADING_OVERLAY_DELAY_MS = 250;
export const AUTH_LOADING_OVERLAY_MIN_VISIBLE_MS = 400;
export const AUTH_LOADING_SUCCESS_VISIBLE_MS = 500;
export const AUTH_PROGRESS_UPDATE_INTERVAL_MS = 250;

function readPositiveNumber(value, fallback) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

export const AUTH_COLD_START_ESTIMATE_MS = readPositiveNumber(
  import.meta.env.VITE_LOGIN_COLD_START_ESTIMATE_MS,
  150000
);

export const AUTH_REQUEST_TIMEOUT_MS = Math.max(
  readPositiveNumber(import.meta.env.VITE_LOGIN_TIMEOUT_MS, 600000),
  AUTH_COLD_START_ESTIMATE_MS + 1000
);

export function calculateAuthEstimatedProgress(elapsedMs) {
  if (elapsedMs <= 0) {
    return 1;
  }

  if (elapsedMs <= AUTH_COLD_START_ESTIMATE_MS) {
    const ratio = elapsedMs / AUTH_COLD_START_ESTIMATE_MS;
    return Math.min(95, Math.max(1, Math.round(1 + ratio * 94)));
  }

  const overtimeWindow = Math.max(
    1,
    AUTH_REQUEST_TIMEOUT_MS - AUTH_COLD_START_ESTIMATE_MS
  );
  const overtimeRatio = Math.min(
    1,
    (elapsedMs - AUTH_COLD_START_ESTIMATE_MS) / overtimeWindow
  );

  return Math.min(99, Math.round(95 + overtimeRatio * 4));
}

export function formatAuthDuration(durationMs, language) {
  const totalSeconds = Math.max(0, Math.ceil(durationMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (language === "ja") {
    if (minutes === 0) {
      return `${seconds}秒`;
    }

    if (seconds === 0) {
      return `${minutes}分`;
    }

    return `${minutes}分 ${seconds}秒`;
  }

  if (minutes === 0) {
    return `${seconds}초`;
  }

  if (seconds === 0) {
    return `${minutes}분`;
  }

  return `${minutes}분 ${seconds}초`;
}
