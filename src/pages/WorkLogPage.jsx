import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import LanguageSelector from "../components/LanguageSelector";
import { useLanguage } from "../i18n/LanguageContext";
import {
  getDifficultyClassName,
  translateDifficulty,
} from "../utils/difficulty";
import "./WorkLogPage.css";

const EMPTY_FORM = {
  title: "",
  content: "",
};

const parseTechTags = (techTags) => {
  if (!techTags) {
    return [];
  }

  if (Array.isArray(techTags)) {
    return techTags
      .map((tag) => String(tag).trim())
      .filter(Boolean);
  }

  if (typeof techTags !== "string") {
    return [];
  }

  const trimmed = techTags.trim();

  if (!trimmed) {
    return [];
  }

  try {
    const parsed = JSON.parse(trimmed);

    if (Array.isArray(parsed)) {
      return parsed
        .map((tag) => String(tag).trim())
        .filter(Boolean);
    }
  } catch {
    // JSON 배열이 아니라면 쉼표 문자열로 처리한다.
  }

  return trimmed
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
};

const parseInterviewQuestions = (questions) => {
  if (!questions) {
    return [];
  }

  if (Array.isArray(questions)) {
    return questions
      .map((question) => String(question).trim())
      .filter(Boolean);
  }

  if (typeof questions !== "string") {
    return [];
  }

  const trimmed = questions.trim();

  if (!trimmed) {
    return [];
  }

  try {
    const parsed = JSON.parse(trimmed);

    if (Array.isArray(parsed)) {
      return parsed
        .map((question) => String(question).trim())
        .filter(Boolean);
    }
  } catch {
    // JSON 배열이 아니라면 줄바꿈 문자열로 처리한다.
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
  if (!dateTime) {
    return "";
  }

  const date = new Date(dateTime);

  if (Number.isNaN(date.getTime())) {
    return dateTime;
  }

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

function WorkLogPage() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  const [workLogs, setWorkLogs] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [formErrorMessage, setFormErrorMessage] = useState("");

  const userId = Number(localStorage.getItem("userId"));

  const isEditing = editingId !== null;

  const sortedWorkLogs = useMemo(() => {
    return [...workLogs].sort((first, second) => {
      const firstDate = new Date(first.createdAt).getTime();
      const secondDate = new Date(second.createdAt).getTime();

      return secondDate - firstDate;
    });
  }, [workLogs]);

  useEffect(() => {
    if (!userId) {
      navigate("/login", { replace: true });
      return;
    }

    fetchWorkLogs();
  }, [userId, navigate]);

  const fetchWorkLogs = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await api.get(`/api/work/${userId}`);

      setWorkLogs(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (error) {
      console.error("업무일지 조회 실패:", error);
      setErrorMessage(t("workLog.loadError"));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (formErrorMessage) {
      setFormErrorMessage("");
    }
  };

  const validateForm = () => {
    if (!form.title.trim()) {
      setFormErrorMessage(t("workLog.titleRequired"));
      return false;
    }

    if (!form.content.trim()) {
  setFormErrorMessage(t("workLog.contentRequired"));
  return false;
}

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const requestBody = {
      userId,
      title: form.title.trim(),
      content: form.content.trim(),
      language,
    };

    try {
      setSubmitting(true);
      setFormErrorMessage("");

      if (isEditing) {
        await api.put(`/api/work/${editingId}`, requestBody);
      } else {
        await api.post("/api/work", requestBody);
      }

      resetForm();
      await fetchWorkLogs();
    } catch (error) {
      console.error("업무일지 저장 실패:", error);

      const serverMessage =
        error.response?.data?.message ||
        error.response?.data?.error;

      setFormErrorMessage(
        serverMessage || t("workLog.saveError")
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (workLog) => {
    setEditingId(workLog.id);

    setForm({
      title: workLog.title || "",
      content: workLog.content || "",
    });

    setFormErrorMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (workLogId) => {
    const confirmed = window.confirm(
      t("workLog.deleteConfirm")
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(workLogId);
      setErrorMessage("");

      await api.delete(`/api/work/${workLogId}`);

      setWorkLogs((previous) =>
        previous.filter(
          (workLog) => workLog.id !== workLogId
        )
      );

      if (editingId === workLogId) {
        resetForm();
      }
    } catch (error) {
      console.error("업무일지 삭제 실패:", error);

      setErrorMessage(t("workLog.deleteError"));
    } finally {
      setDeletingId(null);
    }
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setFormErrorMessage("");
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("nickname");
    navigate("/login", { replace: true });
  };

  return (
    <main className="work-log-page">
      <header className="work-log-header">
        <div className="work-log-heading">
          <p className="work-log-eyebrow">
            {t("workLog.eyebrow")}
          </p>

          <h1>{t("workLog.title")}</h1>

          <p className="work-log-description">
            {t("workLog.description")}
          </p>
        </div>

        <div className="work-log-header-actions">
          <LanguageSelector />

          <Link
            to="/dashboard"
            className="work-log-dashboard-link"
          >
            {t("navigation.dashboard")}
          </Link>

          <button
            type="button"
            className="work-log-logout-button"
            onClick={handleLogout}
          >
            {t("navigation.logout")}
          </button>
        </div>
      </header>

      <section className="work-log-form-card">
        <div className="work-log-section-heading">
          <div>
            <p className="work-log-section-label">
              {isEditing
                ? t("workLog.editEntryLabel")
                : t("workLog.newEntryLabel")}
            </p>

            <h2>
              {isEditing
                ? t("workLog.editTitle")
                : t("workLog.createTitle")}
            </h2>
          </div>

          {isEditing && (
            <button
              type="button"
              className="work-log-form-cancel-top"
              onClick={resetForm}
              disabled={submitting}
            >
              {t("common.cancel")}
            </button>
          )}
        </div>

        <form
          className="work-log-form"
          onSubmit={handleSubmit}
        >
          <label className="work-log-field">
            <span>{t("workLog.titleLabel")}</span>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleInputChange}
              placeholder={t("workLog.titlePlaceholder")}
              maxLength={200}
              disabled={submitting}
            />
          </label>

          <label className="work-log-field">
            <span>{t("workLog.contentLabel")}</span>

            <textarea
              name="content"
              value={form.content}
              onChange={handleInputChange}
              placeholder={t(
                "workLog.contentPlaceholder"
              )}
              rows={10}
              disabled={submitting}
            />
          </label>

          {formErrorMessage && (
            <div
              className="work-log-form-error"
              role="alert"
            >
              {formErrorMessage}
            </div>
          )}

          <div className="work-log-form-actions">
            {isEditing && (
              <button
                type="button"
                className="work-log-secondary-button"
                onClick={resetForm}
                disabled={submitting}
              >
                {t("common.cancel")}
              </button>
            )}

            <button
              type="submit"
              className="work-log-primary-button"
              disabled={submitting}
            >
              {submitting
                ? t("workLog.analyzing")
                : isEditing
                  ? t("workLog.updateButton")
                  : t("workLog.createButton")}
            </button>
          </div>
        </form>
      </section>

      <section className="work-log-list-section">
        <div className="work-log-list-header">
          <div>
            <p className="work-log-section-label">
              WORK HISTORY
            </p>

            <h2>{t("workLog.title")}</h2>
          </div>

          <span className="work-log-count">
            {sortedWorkLogs.length}
          </span>
        </div>

        {errorMessage && (
          <div className="work-log-page-error">
            <p>{errorMessage}</p>

            <button type="button" onClick={fetchWorkLogs}>
              {t("common.retry")}
            </button>
          </div>
        )}

        {loading ? (
          <div className="work-log-loading">
            <div className="work-log-spinner" />
            <p>{t("common.loading")}</p>
          </div>
        ) : sortedWorkLogs.length === 0 ? (
          <div className="work-log-empty">
            <div className="work-log-empty-icon">✦</div>
            <p>{t("workLog.empty")}</p>
          </div>
        ) : (
          <div className="work-log-card-list">
            {sortedWorkLogs.map((workLog) => {
              const tags = parseTechTags(
                workLog.techTags
              );

              const questions =
                parseInterviewQuestions(
                  workLog.interviewQuestions
                );

              const difficultyClass =
                getDifficultyClassName(
                  workLog.difficulty
                );

              return (
                <article
                  className="work-log-card"
                  key={workLog.id}
                >
                  <header className="work-log-card-header">
                    <div className="work-log-card-title-area">
                      <div className="work-log-card-meta">
                        <time>
                          {formatDateTime(
                            workLog.createdAt,
                            language
                          )}
                        </time>

                        <span
                          className={`work-log-difficulty difficulty-${difficultyClass}`}
                        >
                          {translateDifficulty(
                            workLog.difficulty,
                            t
                          )}
                        </span>
                      </div>

                      <h3>{workLog.title}</h3>
                    </div>

                    <div className="work-log-card-actions">
                      <button
                        type="button"
                        className="work-log-edit-button"
                        onClick={() =>
                          handleEdit(workLog)
                        }
                        disabled={
                          submitting ||
                          deletingId === workLog.id
                        }
                      >
                        {t("common.edit")}
                      </button>

                      <button
                        type="button"
                        className="work-log-delete-button"
                        onClick={() =>
                          handleDelete(workLog.id)
                        }
                        disabled={
                          submitting ||
                          deletingId === workLog.id
                        }
                      >
                        {deletingId === workLog.id
                          ? "..."
                          : t("common.delete")}
                      </button>
                    </div>
                  </header>

                  <section className="work-log-content-section">
                    <h4>
                      {t("workLog.contentLabel")}
                    </h4>

                    <p>{workLog.content}</p>
                  </section>

                  <div className="work-log-ai-grid">
                    <section className="work-log-ai-panel work-log-summary-panel">
                      <div className="work-log-ai-title">
                        <span className="work-log-ai-icon">
                          AI
                        </span>

                        <h4>
                          {t("workLog.aiSummary")}
                        </h4>
                      </div>

                      <p>
                        {workLog.aiSummary ||
                          t("common.noData")}
                      </p>
                    </section>

                    <section className="work-log-ai-panel">
                      <h4>{t("workLog.techTags")}</h4>

                      {tags.length > 0 ? (
                        <div className="work-log-tag-list">
                          {tags.map((tag) => (
                            <span
                              className="work-log-tag"
                              key={`${workLog.id}-${tag}`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="work-log-no-data">
                          {t("common.noData")}
                        </p>
                      )}
                    </section>
                  </div>

                  <section className="work-log-question-section">
                    <h4>
                      {t(
                        "workLog.interviewQuestions"
                      )}
                    </h4>

                    {questions.length > 0 ? (
                      <ol>
                        {questions.map(
                          (question, index) => (
                            <li
                              key={`${workLog.id}-${index}`}
                            >
                              {question}
                            </li>
                          )
                        )}
                      </ol>
                    ) : (
                      <p className="work-log-no-data">
                        {t("common.noData")}
                      </p>
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

export default WorkLogPage;