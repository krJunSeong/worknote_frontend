import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useLanguage } from "../i18n/LanguageContext";
import "./GoalPage.css";

const EMPTY_FORM = {
  title: "",
  description: "",
  targetDate: "",
  status: "PLANNED",
  progress: 0,
};

const statusKey = (status) => {
  if (status === "COMPLETED") return "completed";
  if (status === "IN_PROGRESS") return "inProgress";
  return "planned";
};

const formatDate = (dateString, language) => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-").map(Number);
  return new Intl.DateTimeFormat(language === "ja" ? "ja-JP" : "ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    weekday: "short",
  }).format(new Date(year, month - 1, day));
};

function GoalPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      const response = await api.get("/api/goals");
      setGoals(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("목표 조회 실패:", error);
      setErrorMessage(t("goal.loadError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  useEffect(() => {
    if (!goals.length) return;
    const goalId = new URLSearchParams(location.search).get("goalId");
    if (!goalId) return;
    const target = goals.find((goal) => String(goal.id) === String(goalId));
    if (target) {
      setForm({
        title: target.title || "",
        description: target.description || "",
        targetDate: target.targetDate || "",
        status: target.status || "PLANNED",
        progress: Number(target.progress || 0),
      });
      setEditingId(target.id);
      navigate("/goals", { replace: true });
      window.requestAnimationFrame(() => {
        document.querySelector(".goal-form-card")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [goals, location.search, navigate]);

  const stats = useMemo(() => ({
    total: goals.length,
    active: goals.filter((goal) => goal.status === "IN_PROGRESS").length,
    completed: goals.filter((goal) => goal.status === "COMPLETED").length,
    overdue: goals.filter((goal) => goal.overdue).length,
  }), [goals]);

  const visibleGoals = useMemo(() => {
    if (filter === "ALL") return goals;
    if (filter === "OVERDUE") return goals.filter((goal) => goal.overdue);
    return goals.filter((goal) => goal.status === filter);
  }, [filter, goals]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const handleProgressChange = (event) => {
    const progress = Number(event.target.value);
    setForm((previous) => ({
      ...previous,
      progress,
      status:
        progress >= 100
          ? "COMPLETED"
          : progress > 0 && previous.status === "PLANNED"
            ? "IN_PROGRESS"
            : previous.status === "COMPLETED"
              ? "IN_PROGRESS"
              : previous.status,
    }));
  };

  const handleStatusChange = (event) => {
    const status = event.target.value;
    setForm((previous) => ({
      ...previous,
      status,
      progress: status === "COMPLETED" ? 100 : previous.progress === 100 ? 90 : previous.progress,
    }));
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setErrorMessage("");
  };

  const startEdit = (goal) => {
    setEditingId(goal.id);
    setForm({
      title: goal.title || "",
      description: goal.description || "",
      targetDate: goal.targetDate || "",
      status: goal.status || "PLANNED",
      progress: Number(goal.progress || 0),
    });
    document.querySelector(".goal-form-card")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.title.trim()) {
      setErrorMessage(t("goal.titleRequired"));
      return;
    }
    if (!form.targetDate) {
      setErrorMessage(t("goal.targetDateRequired"));
      return;
    }

    const body = {
      title: form.title.trim(),
      description: form.description.trim(),
      targetDate: form.targetDate,
      status: form.status,
      progress: Number(form.progress),
    };

    try {
      setSubmitting(true);
      setErrorMessage("");
      if (editingId) {
        const response = await api.put(`/api/goals/${editingId}`, body);
        setGoals((previous) => previous.map((goal) => goal.id === editingId ? response.data : goal));
      } else {
        const response = await api.post("/api/goals", body);
        setGoals((previous) => [...previous, response.data].sort((a, b) => String(a.targetDate).localeCompare(String(b.targetDate))));
      }
      resetForm();
    } catch (error) {
      console.error("목표 저장 실패:", error);
      setErrorMessage(error.response?.data?.message || t("goal.saveError"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t("goal.deleteConfirm"))) return;
    try {
      await api.delete(`/api/goals/${id}`);
      setGoals((previous) => previous.filter((goal) => goal.id !== id));
      if (editingId === id) resetForm();
    } catch (error) {
      console.error("목표 삭제 실패:", error);
      setErrorMessage(t("goal.deleteError"));
    }
  };

  const filters = [
    ["ALL", t("goal.all")],
    ["PLANNED", t("goal.planned")],
    ["IN_PROGRESS", t("goal.inProgress")],
    ["COMPLETED", t("goal.completed")],
    ["OVERDUE", t("goal.overdue")],
  ];

  return (
    <main className="goal-page">
      <header className="goal-page-header">
        <div>
          <p className="page-eyebrow">{t("goal.eyebrow")}</p>
          <h1>{t("goal.title")}</h1>
          <p>{t("goal.description")}</p>
        </div>
        <span className="goal-calendar-hint">{t("goal.calendarHint")}</span>
      </header>

      <section className="goal-stat-grid">
        <article><span>{t("goal.total")}</span><strong>{stats.total}</strong></article>
        <article><span>{t("goal.active")}</span><strong>{stats.active}</strong></article>
        <article><span>{t("goal.completedCount")}</span><strong>{stats.completed}</strong></article>
        <article className={stats.overdue ? "is-alert" : ""}><span>{t("goal.overdueCount")}</span><strong>{stats.overdue}</strong></article>
      </section>

      <div className="goal-layout">
        <section className="goal-list-card">
          <div className="goal-list-toolbar">
            <div className="goal-filter-list">
              {filters.map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={filter === value ? "is-active" : ""}
                  onClick={() => setFilter(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="goal-state"><div className="goal-spinner" /><span>{t("common.loading")}</span></div>
          ) : visibleGoals.length === 0 ? (
            <div className="goal-state"><p>{t("goal.empty")}</p></div>
          ) : (
            <div className="goal-list">
              {visibleGoals.map((goal) => (
                <article key={goal.id} className={`goal-card ${goal.overdue ? "is-overdue" : ""}`}>
                  <div className="goal-card-head">
                    <div>
                      <span className={`goal-status is-${statusKey(goal.status)} ${goal.overdue ? "is-overdue" : ""}`}>
                        {goal.overdue ? t("goal.overdue") : t(`goal.${statusKey(goal.status)}`)}
                      </span>
                      <h3>{goal.title}</h3>
                    </div>
                    <time>{formatDate(goal.targetDate, language)}</time>
                  </div>

                  {goal.description && <p className="goal-card-description">{goal.description}</p>}

                  <div className="goal-progress-row">
                    <div className="goal-progress-track"><span style={{ width: `${goal.progress}%` }} /></div>
                    <strong>{goal.progress}%</strong>
                  </div>

                  <div className="goal-card-actions">
                    <button type="button" onClick={() => startEdit(goal)}>{t("goal.edit")}</button>
                    <button type="button" className="is-danger" onClick={() => handleDelete(goal.id)}>{t("goal.delete")}</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="goal-form-card">
          <div className="goal-form-head">
            <span>PLAN</span>
            <h2>{editingId ? t("goal.editTitle") : t("goal.createTitle")}</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <label>
              <span>{t("goal.titleLabel")} <small>{form.title.length}/120</small></span>
              <input name="title" value={form.title} onChange={handleChange} maxLength={120} placeholder={t("goal.titlePlaceholder")} disabled={submitting} />
            </label>

            <label>
              <span>{t("goal.descriptionLabel")} <small>{form.description.length}/3000</small></span>
              <textarea name="description" value={form.description} onChange={handleChange} maxLength={3000} rows={7} placeholder={t("goal.descriptionPlaceholder")} disabled={submitting} />
            </label>

            <div className="goal-form-row">
              <label>
                <span>{t("goal.targetDateLabel")}</span>
                <input type="date" name="targetDate" value={form.targetDate} onChange={handleChange} disabled={submitting} />
              </label>
              <label>
                <span>{t("goal.statusLabel")}</span>
                <select name="status" value={form.status} onChange={handleStatusChange} disabled={submitting}>
                  <option value="PLANNED">{t("goal.planned")}</option>
                  <option value="IN_PROGRESS">{t("goal.inProgress")}</option>
                  <option value="COMPLETED">{t("goal.completed")}</option>
                </select>
              </label>
            </div>

            <label className="goal-progress-field">
              <span>{t("goal.progressLabel")} <strong>{form.progress}%</strong></span>
              <input type="range" min="0" max="100" step="5" value={form.progress} onChange={handleProgressChange} disabled={submitting} />
            </label>

            {errorMessage && <div className="goal-form-error">{errorMessage}</div>}

            <div className="goal-form-actions">
              {editingId && <button type="button" onClick={resetForm} disabled={submitting}>{t("goal.cancelEdit")}</button>}
              <button type="submit" className="is-primary" disabled={submitting}>{editingId ? t("goal.update") : t("goal.save")}</button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

export default GoalPage;
