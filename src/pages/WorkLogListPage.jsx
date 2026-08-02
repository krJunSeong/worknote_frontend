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
    return techTags.map((tag) => String(tag).trim()).filter(Boolean);
  }
  if (typeof techTags !== "string") return [];

  const trimmed = techTags.trim();
  if (!trimmed) return [];

  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed.map((tag) => String(tag).trim()).filter(Boolean);
    }
  } catch {
    // JSON 배열이 아니면 쉼표 구분 문자열로 처리한다.
  }

  return trimmed.split(",").map((tag) => tag.trim()).filter(Boolean);
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

function WorkLogListPage() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const userId = Number(localStorage.getItem("userId"));

  const [workLogs, setWorkLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const sortedWorkLogs = useMemo(() => {
    return [...workLogs].sort((first, second) => {
      return (
        new Date(second.createdAt).getTime() -
        new Date(first.createdAt).getTime()
      );
    });
  }, [workLogs]);

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

  return (
    <main className="work-list-page">
      <header className="work-list-header">
        <div>
          <p className="page-eyebrow">{t("workLog.historyLabel")}</p>
          <h1>{t("workLog.listTitle")}</h1>
          <p>{t("workLog.listDescription")}</p>
        </div>

        <div className="work-list-header-actions">
          <div className="work-list-total">
            <span>{t("workLog.totalEntries")}</span>
            <strong>{sortedWorkLogs.length}</strong>
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
      </header>

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
      ) : sortedWorkLogs.length === 0 ? (
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
      ) : (
        <section className="work-list-grid">
          {sortedWorkLogs.map((workLog) => {
            const tags = parseTechTags(workLog.techTags);
            const questions = parseInterviewQuestions(
              workLog.interviewQuestions
            );
            const difficultyClass = getDifficultyClassName(
              workLog.difficulty
            );

            return (
              <article className="work-record-card" key={workLog.id}>
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
                          <span key={`${workLog.id}-${tag}`}>{tag}</span>
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
                        <li key={`${workLog.id}-${index}`}>{question}</li>
                      ))}
                    </ol>
                  ) : (
                    <p>{t("common.noData")}</p>
                  )}
                </section>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}

export default WorkLogListPage;
