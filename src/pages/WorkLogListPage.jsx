import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useLanguage } from "../i18n/LanguageContext";
import {
  getDifficultyClassName,
  translateDifficulty,
} from "../utils/difficulty";
import "./WorkLogListPage.css";

const parseTechTags = (techTags) => {
  if (!techTags) return [];

  if (Array.isArray(techTags)) {
    return techTags
      .map((tag) => String(tag).trim())
      .filter(Boolean);
  }

  if (typeof techTags !== "string") return [];

  const trimmed = techTags.trim();
  if (!trimmed) return [];

  try {
    const parsed = JSON.parse(trimmed);

    if (Array.isArray(parsed)) {
      return parsed
        .map((tag) => String(tag).trim())
        .filter(Boolean);
    }
  } catch {
    // JSON 배열이 아니면 쉼표 구분 문자열로 처리한다.
  }

  return trimmed
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
};

const parseInterviewQuestions = (questions) => {
  if (!questions) return [];

  if (Array.isArray(questions)) {
    return questions
      .map((question) => String(question).trim())
      .filter(Boolean);
  }

  if (typeof questions !== "string") return [];

  const trimmed = questions.trim();
  if (!trimmed) return [];

  try {
    const parsed = JSON.parse(trimmed);

    if (Array.isArray(parsed)) {
      return parsed
        .map((question) => String(question).trim())
        .filter(Boolean);
    }
  } catch {
    // JSON 배열이 아니면 줄바꿈 구분 문자열로 처리한다.
  }

  return trimmed
    .split(/\r?\n/)
    .map((question) =>
      question
        .replace(/^[-•]\s*/, "")
        .replace(/^\d+[.)]\s*/, "")
        .trim()
    )
    .filter(Boolean);
};

const formatDateTime = (dateTime, language) => {
  if (!dateTime) return "";

  const date = new Date(dateTime);
  if (Number.isNaN(date.getTime())) return dateTime;

  return new Intl.DateTimeFormat(
    language === "ja" ? "ja-JP" : "ko-KR",
    {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(date);
};

const SearchIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

function WorkLogListPage() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const userId = Number(localStorage.getItem("userId"));

  const [workLogs, setWorkLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  const visibleWorkLogs = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const filtered = workLogs.filter((workLog) => {
      const difficulty = getDifficultyClassName(workLog.difficulty);

      if (
        difficultyFilter !== "all" &&
        difficulty !== difficultyFilter
      ) {
        return false;
      }

      if (!normalizedQuery) return true;

      const searchableText = [
        workLog.title,
        workLog.content,
        workLog.aiSummary,
        ...parseTechTags(workLog.techTags),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });

    return [...filtered].sort((first, second) => {
      const firstTime = new Date(first.createdAt).getTime();
      const secondTime = new Date(second.createdAt).getTime();

      return sortOrder === "oldest"
        ? firstTime - secondTime
        : secondTime - firstTime;
    });
  }, [workLogs, searchQuery, difficultyFilter, sortOrder]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    difficultyFilter !== "all" ||
    sortOrder !== "newest";

  const fetchWorkLogs = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await api.get(`/api/work/${userId}`);
      setWorkLogs(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("업무일지 조회 실패:", error);
      setErrorMessage(t("workLog.loadError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkLogs();
  }, [userId]);

  const handleDelete = async (workLogId) => {
    if (!window.confirm(t("workLog.deleteConfirm"))) return;

    try {
      setDeletingId(workLogId);
      setErrorMessage("");
      await api.delete(`/api/work/${workLogId}`);
      setWorkLogs((previous) =>
        previous.filter((workLog) => workLog.id !== workLogId)
      );
    } catch (error) {
      console.error("업무일지 삭제 실패:", error);
      setErrorMessage(t("workLog.deleteError"));
    } finally {
      setDeletingId(null);
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setDifficultyFilter("all");
    setSortOrder("newest");
  };

  const difficultyFilters = [
    ["all", t("workLog.filterAll")],
    ["beginner", t("difficulty.beginner")],
    ["intermediate", t("difficulty.intermediate")],
    ["advanced", t("difficulty.advanced")],
    ["unclassified", t("difficulty.unclassified")],
  ];

  return (
    <main className="work-list-page">
      <header className="work-list-header">
        <p className="page-eyebrow">{t("workLog.historyLabel")}</p>
        <h1>{t("workLog.listTitle")}</h1>
        <p>{t("workLog.listDescription")}</p>
      </header>

      <section className="work-list-records-section">
        <div className="work-list-section-header">
          <div className="work-list-section-title-area">
            <p className="work-list-section-label">
              {t("workLog.totalEntries")}
            </p>

            <div className="work-list-title-row">
              <h2>{t("workLog.recordsSectionTitle")}</h2>
              <span className="work-list-count-badge">
                {workLogs.length}
              </span>
            </div>

            <p className="work-list-section-description">
              {t("workLog.recordsSectionDescription")}
            </p>
          </div>

          <button
            type="button"
            className="work-list-create-button"
            onClick={() => navigate("/work/create")}
          >
            <span aria-hidden="true">＋</span>
            {t("navigation.workLogCreate")}
          </button>
        </div>

        <div className="work-list-toolbar">
          <label className="work-list-search">
            <span className="work-list-search-icon">
              <SearchIcon />
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t("workLog.searchPlaceholder")}
              aria-label={t("workLog.searchPlaceholder")}
            />
          </label>

          <div
            className="work-list-filter-chips"
            role="group"
            aria-label={t("workLog.difficultyFilter")}
          >
            {difficultyFilters.map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={
                  difficultyFilter === value ? "is-active" : ""
                }
                onClick={() => setDifficultyFilter(value)}
                aria-pressed={difficultyFilter === value}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="work-list-toolbar-end">
            <label className="work-list-sort">
              <span>{t("workLog.sortLabel")}</span>
              <select
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
              >
                <option value="newest">
                  {t("workLog.sortNewest")}
                </option>
                <option value="oldest">
                  {t("workLog.sortOldest")}
                </option>
              </select>
            </label>

            {hasActiveFilters && (
              <button
                type="button"
                className="work-list-reset-button"
                onClick={resetFilters}
              >
                {t("workLog.filterReset")}
              </button>
            )}
          </div>
        </div>

        <div className="work-list-result-summary" aria-live="polite">
          <strong>{visibleWorkLogs.length}</strong>
          <span>
            {t("workLog.visibleEntries")} / {workLogs.length}
          </span>
        </div>

        {errorMessage && (
          <div className="work-list-error" role="alert">
            <p>{errorMessage}</p>
            <button type="button" onClick={fetchWorkLogs}>
              {t("common.retry")}
            </button>
          </div>
        )}

        {loading ? (
          <div className="work-list-state">
            <div className="work-list-spinner" />
            <p>{t("common.loading")}</p>
          </div>
        ) : workLogs.length === 0 ? (
          <div className="work-list-empty">
            <div className="work-list-empty-art" aria-hidden="true">
              <span>✦</span>
            </div>
            <h2>{t("workLog.emptyTitle")}</h2>
            <p>{t("workLog.emptyDescription")}</p>
            <button type="button" onClick={() => navigate("/work/create")}>
              {t("navigation.workLogCreate")}
            </button>
          </div>
        ) : visibleWorkLogs.length === 0 ? (
          <div className="work-list-no-results">
            <div className="work-list-no-results-icon" aria-hidden="true">
              <SearchIcon />
            </div>
            <h2>{t("workLog.noSearchResultsTitle")}</h2>
            <p>{t("workLog.noSearchResultsDescription")}</p>
            <button type="button" onClick={resetFilters}>
              {t("workLog.filterReset")}
            </button>
          </div>
        ) : (
          <div className="work-list-grid">
            {visibleWorkLogs.map((workLog) => {
              const tags = parseTechTags(workLog.techTags);
              const questions = parseInterviewQuestions(
                workLog.interviewQuestions
              );
              const difficultyClass = getDifficultyClassName(
                workLog.difficulty
              );

              return (
                <article
                  className={`work-record-card difficulty-card-${difficultyClass}`}
                  key={workLog.id}
                >
                  <header className="work-record-header">
                    <div className="work-record-title-area">
                      <div className="work-record-meta">
                        <time>
                          {formatDateTime(workLog.createdAt, language)}
                        </time>
                        <span
                          className={`work-record-difficulty difficulty-${difficultyClass}`}
                        >
                          {translateDifficulty(workLog.difficulty, t)}
                        </span>
                      </div>
                      <h2>{workLog.title}</h2>
                    </div>

                    <div className="work-record-actions">
                      <button
                        type="button"
                        className="work-record-edit"
                        onClick={() =>
                          navigate(`/work/edit/${workLog.id}`, {
                            state: { workLog },
                          })
                        }
                        disabled={deletingId === workLog.id}
                      >
                        {t("common.edit")}
                      </button>
                      <button
                        type="button"
                        className="work-record-delete"
                        onClick={() => handleDelete(workLog.id)}
                        disabled={deletingId === workLog.id}
                      >
                        {deletingId === workLog.id
                          ? "..."
                          : t("common.delete")}
                      </button>
                    </div>
                  </header>

                  <section className="work-record-content">
                    <h3>{t("workLog.contentLabel")}</h3>
                    <p>{workLog.content}</p>
                  </section>

                  <div className="work-record-insights">
                    <section className="work-record-ai-summary">
                      <div className="work-record-section-title">
                        <span>AI</span>
                        <h3>{t("workLog.aiSummary")}</h3>
                      </div>
                      <p>{workLog.aiSummary || t("common.noData")}</p>
                    </section>

                    <section className="work-record-tags">
                      <h3>{t("workLog.techTags")}</h3>
                      {tags.length > 0 ? (
                        <div>
                          {tags.map((tag) => (
                            <span key={`${workLog.id}-${tag}`}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p>{t("common.noData")}</p>
                      )}
                    </section>
                  </div>

                  <section className="work-record-questions">
                    <h3>{t("workLog.interviewQuestions")}</h3>
                    {questions.length > 0 ? (
                      <ol>
                        {questions.map((question, index) => (
                          <li key={`${workLog.id}-${index}`}>
                            {question}
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p>{t("common.noData")}</p>
                    )}
                  </section>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default WorkLogListPage;
