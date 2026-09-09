import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import { useLanguage } from "../i18n/LanguageContext";
import { getDifficultyClassName, translateDifficulty } from "../utils/difficulty";
import "./WorkLogDetailPage.css";

const splitList = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);

  const text = String(value).trim();
  if (!text) return [];

  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) {
      return parsed.map(String).map((item) => item.trim()).filter(Boolean);
    }
  } catch {
    // 일반 문자열이면 아래 규칙으로 분리한다.
  }

  return text
    .split(/\r?\n|,/)
    .map((item) => item.replace(/^[-•]\s*/, "").replace(/^\d+[.)]\s*/, "").trim())
    .filter(Boolean);
};

const formatDateTime = (value, language) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(language === "ja" ? "ja-JP" : "ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

function WorkLogDetailPage() {
  const navigate = useNavigate();
  const { workLogId } = useParams();
  const { language, t } = useLanguage();
  const [workLog, setWorkLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchWorkLog = async () => {
      try {
        setLoading(true);
        setErrorMessage("");
        const userId = Number(localStorage.getItem("userId"));
        const response = await api.get(`/api/work/${userId}`);
        const list = Array.isArray(response.data) ? response.data : [];
        const entry = list.find((item) => String(item.id) === String(workLogId));
        if (!entry) {
          throw new Error(t("workLog.loadError"));
        }
        setWorkLog(entry);
      } catch (error) {
        console.error("업무일지 상세 조회 실패:", error);
        setErrorMessage(error.response?.data?.message || t("workLog.loadError"));
      } finally {
        setLoading(false);
      }
    };

    fetchWorkLog();
  }, [t, workLogId]);

  const tags = useMemo(() => splitList(workLog?.techTags), [workLog?.techTags]);
  const questions = useMemo(() => splitList(workLog?.interviewQuestions), [workLog?.interviewQuestions]);

  if (loading) {
    return (
      <main className="work-detail-page">
        <div className="work-detail-state"><div className="work-detail-spinner" /><span>{t("common.loading")}</span></div>
      </main>
    );
  }

  if (!workLog || errorMessage) {
    return (
      <main className="work-detail-page">
        <div className="work-detail-state is-error">
          <p>{errorMessage || t("workLog.loadError")}</p>
          <button type="button" onClick={() => navigate("/work/list")}>{t("workLog.backToList")}</button>
        </div>
      </main>
    );
  }

  return (
    <main className="work-detail-page">
      <header className="work-detail-header">
        <div>
          <p className="page-eyebrow">{t("workLog.detailEyebrow")}</p>
          <h1>{t("workLog.detailTitle")}</h1>
          <p>{t("workLog.detailDescription")}</p>
        </div>
        <div className="work-detail-header-actions">
          <button type="button" onClick={() => navigate("/work/list")}>{t("workLog.backToList")}</button>
          <button type="button" className="is-primary" onClick={() => navigate(`/work/edit/${workLog.id}`, { state: { workLog } })}>{t("workLog.editThisEntry")}</button>
        </div>
      </header>

      <section className="work-detail-main-card">
        <div className="work-detail-title-row">
          <div>
            <span className={`work-detail-difficulty is-${getDifficultyClassName(workLog.difficulty)}`}>
              {translateDifficulty(workLog.difficulty, t)}
            </span>
            <h2>{workLog.title}</h2>
          </div>
          <time>{formatDateTime(workLog.createdAt, language)}</time>
        </div>

        <div className="work-detail-content">
          <h3>{t("workLog.contentLabel")}</h3>
          <p>{workLog.content}</p>
        </div>
      </section>

      <div className="work-detail-analysis-grid">
        <section className="work-detail-panel is-summary">
          <span>AI SUMMARY</span>
          <h3>{t("workLog.aiSummary")}</h3>
          <p>{workLog.aiSummary || t("common.noData")}</p>
        </section>

        <section className="work-detail-panel">
          <span>TECH STACK</span>
          <h3>{t("workLog.techTags")}</h3>
          {tags.length ? <div className="work-detail-tags">{tags.map((tag) => <em key={tag}>{tag}</em>)}</div> : <p>{t("common.noData")}</p>}
        </section>

        <section className="work-detail-panel is-wide">
          <span>INTERVIEW PREP</span>
          <h3>{t("workLog.interviewQuestions")}</h3>
          {questions.length ? (
            <ol>{questions.map((question) => <li key={question}>{question}</li>)}</ol>
          ) : <p>{t("common.noData")}</p>}
        </section>
      </div>
    </main>
  );
}

export default WorkLogDetailPage;
