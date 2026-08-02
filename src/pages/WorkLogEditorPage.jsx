import { useEffect, useMemo, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import api from "../api/api";
import { useLanguage } from "../i18n/LanguageContext";
import "./WorkLogEditorPage.css";

const EMPTY_FORM = {
  title: "",
  content: "",
};

function WorkLogEditorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { workLogId } = useParams();
  const { language, t } = useLanguage();
  const userId = Number(localStorage.getItem("userId"));
  const isEditing = Boolean(workLogId);

  const [form, setForm] = useState(() => {
    const workLog = location.state?.workLog;
    return workLog
      ? {
          title: workLog.title || "",
          content: workLog.content || "",
        }
      : EMPTY_FORM;
  });
  const [loadingEntry, setLoadingEntry] = useState(
    isEditing && !location.state?.workLog
  );
  const [submitting, setSubmitting] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState("");

  const contentLength = form.content.length;
  const titleLength = form.title.length;

  const completionRate = useMemo(() => {
    let completed = 0;
    if (form.title.trim()) completed += 1;
    if (form.content.trim().length >= 20) completed += 1;
    return completed * 50;
  }, [form]);

  useEffect(() => {
    if (!isEditing || location.state?.workLog) return;

    const fetchEditingEntry = async () => {
      try {
        setLoadingEntry(true);
        const response = await api.get(`/api/work/${userId}`);
        const list = Array.isArray(response.data) ? response.data : [];
        const entry = list.find(
          (workLog) => String(workLog.id) === String(workLogId)
        );

        if (!entry) {
          setFormErrorMessage(t("workLog.entryNotFound"));
          return;
        }

        setForm({
          title: entry.title || "",
          content: entry.content || "",
        });
      } catch (error) {
        console.error("수정할 업무일지 조회 실패:", error);
        setFormErrorMessage(t("workLog.loadError"));
      } finally {
        setLoadingEntry(false);
      }
    };

    fetchEditingEntry();
  }, [isEditing, location.state, t, userId, workLogId]);

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
    if (!validateForm()) return;

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
        await api.put(`/api/work/${workLogId}`, requestBody);
      } else {
        await api.post("/api/work", requestBody);
      }

      navigate("/work/list", { replace: true });
    } catch (error) {
      console.error("업무일지 저장 실패:", error);
      const serverMessage =
        error.response?.data?.message || error.response?.data?.error;
      setFormErrorMessage(serverMessage || t("workLog.saveError"));
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingEntry) {
    return (
      <main className="work-editor-page">
        <div className="work-editor-loading">
          <div className="work-editor-spinner" />
          <p>{t("common.loading")}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="work-editor-page">
      <header className="work-editor-hero">
        <div className="work-editor-hero-copy">
          <p className="page-eyebrow">
            {isEditing
              ? t("workLog.editEntryLabel")
              : t("workLog.newEntryLabel")}
          </p>
          <h1>
            {isEditing ? t("workLog.editTitle") : t("workLog.createTitle")}
          </h1>
          <p>{t("workLog.editorDescription")}</p>
        </div>

        <div className="work-editor-progress-card">
          <div className="work-editor-progress-head">
            <span>{t("workLog.completion")}</span>
            <strong>{completionRate}%</strong>
          </div>
          <div className="work-editor-progress-track">
            <span style={{ width: `${completionRate}%` }} />
          </div>
          <p>{t("workLog.completionDescription")}</p>
        </div>
      </header>

      <div className="work-editor-layout">
        <section className="work-editor-card">
          <div className="work-editor-card-head">
            <div>
              <span className="work-editor-step">01</span>
              <h2>{t("workLog.writeSectionTitle")}</h2>
            </div>
            <span className="work-editor-ai-badge">AI READY</span>
          </div>

          <form className="work-editor-form" onSubmit={handleSubmit}>
            <label className="work-editor-field">
              <span>
                {t("workLog.titleLabel")}
                <small>{titleLength}/200</small>
              </span>
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

            <label className="work-editor-field">
              <span>
                {t("workLog.contentLabel")}
                <small>{contentLength}</small>
              </span>
              <textarea
                name="content"
                value={form.content}
                onChange={handleInputChange}
                placeholder={t("workLog.editorContentPlaceholder")}
                rows={17}
                disabled={submitting}
              />
            </label>

            <div className="work-editor-prompt-chips">
              <span>{t("workLog.promptWhat")}</span>
              <span>{t("workLog.promptWhy")}</span>
              <span>{t("workLog.promptHow")}</span>
              <span>{t("workLog.promptResult")}</span>
            </div>

            {formErrorMessage && (
              <div className="work-editor-error" role="alert">
                {formErrorMessage}
              </div>
            )}

            <div className="work-editor-actions">
              <button
                type="button"
                className="work-editor-cancel"
                onClick={() => navigate("/work/list")}
                disabled={submitting}
              >
                {t("common.cancel")}
              </button>
              <button
                type="submit"
                className="work-editor-submit"
                disabled={submitting}
              >
                <span aria-hidden="true">✦</span>
                {submitting
                  ? t("workLog.analyzing")
                  : isEditing
                    ? t("workLog.updateButton")
                    : t("workLog.createButton")}
              </button>
            </div>
          </form>
        </section>

        <aside className="work-editor-aside">
          <section className="work-editor-flow-card">
            <p className="page-eyebrow">AI WORKFLOW</p>
            <h2>{t("workLog.flowTitle")}</h2>
            <ol>
              <li className={form.title.trim() ? "is-complete" : ""}>
                <span>1</span>
                <div>
                  <strong>{t("workLog.flowWriteTitle")}</strong>
                  <p>{t("workLog.flowWriteDescription")}</p>
                </div>
              </li>
              <li className={form.content.trim().length >= 20 ? "is-complete" : ""}>
                <span>2</span>
                <div>
                  <strong>{t("workLog.flowAnalyzeTitle")}</strong>
                  <p>{t("workLog.flowAnalyzeDescription")}</p>
                </div>
              </li>
              <li>
                <span>3</span>
                <div>
                  <strong>{t("workLog.flowSaveTitle")}</strong>
                  <p>{t("workLog.flowSaveDescription")}</p>
                </div>
              </li>
            </ol>
          </section>

          <section className="work-editor-tip-card">
            <span className="work-editor-tip-icon">✦</span>
            <div>
              <h2>{t("workLog.tipTitle")}</h2>
              <p>{t("workLog.tipDescription")}</p>
            </div>
          </section>

          <section className="work-editor-preview-card">
            <div className="work-editor-preview-head">
              <span>AI</span>
              <strong>{t("workLog.previewTitle")}</strong>
            </div>
            <div className="work-editor-preview-line is-long" />
            <div className="work-editor-preview-line" />
            <div className="work-editor-preview-tags">
              <span />
              <span />
              <span />
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}

export default WorkLogEditorPage;
