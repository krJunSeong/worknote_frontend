import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useLanguage } from "../i18n/LanguageContext";
import "./CalendarPage.css";

const pad = (value) => String(value).padStart(2, "0");

const toDateKey = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const toWorkLogDateKey = (createdAt) =>
  typeof createdAt === "string" && createdAt.length >= 10
    ? createdAt.slice(0, 10)
    : "";

const formatMonthTitle = (year, month, language) =>
  new Intl.DateTimeFormat(language === "ja" ? "ja-JP" : "ko-KR", {
    year: "numeric",
    month: "long",
  }).format(new Date(year, month - 1, 1));

const formatShortDate = (dateKey, language) => {
  if (!dateKey) return "";
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Intl.DateTimeFormat(language === "ja" ? "ja-JP" : "ko-KR", {
    month: "short",
    day: "numeric",
    weekday: "short",
  }).format(new Date(year, month - 1, day));
};

function CalendarPage() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const today = useMemo(() => new Date(), []);

  const [cursor, setCursor] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState(() => toDateKey(today));
  const [calendarData, setCalendarData] = useState({ workLogs: [], goals: [] });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const year = cursor.getFullYear();
  const month = cursor.getMonth() + 1;

  const fetchCalendar = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      const response = await api.get("/api/calendar", {
        params: { year, month },
      });
      setCalendarData({
        workLogs: Array.isArray(response.data?.workLogs) ? response.data.workLogs : [],
        goals: Array.isArray(response.data?.goals) ? response.data.goals : [],
      });
    } catch (error) {
      console.error("캘린더 조회 실패:", error);
      setErrorMessage(t("calendar.loadError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendar();
  }, [year, month]);

  useEffect(() => {
    const sameMonth =
      today.getFullYear() === year && today.getMonth() + 1 === month;
    setSelectedDate(
      sameMonth
        ? toDateKey(today)
        : `${year}-${pad(month)}-01`
    );
  }, [year, month, today]);

  const workLogsByDate = useMemo(() => {
    const map = new Map();
    calendarData.workLogs.forEach((workLog) => {
      const key = toWorkLogDateKey(workLog.createdAt);
      if (!key) return;
      const values = map.get(key) || [];
      values.push(workLog);
      map.set(key, values);
    });
    return map;
  }, [calendarData.workLogs]);

  const goalsByDate = useMemo(() => {
    const map = new Map();
    calendarData.goals.forEach((goal) => {
      const key = goal.targetDate;
      if (!key) return;
      const values = map.get(key) || [];
      values.push(goal);
      map.set(key, values);
    });
    return map;
  }, [calendarData.goals]);

  const cells = useMemo(() => {
    const firstDay = new Date(year, month - 1, 1).getDay();
    const lastDate = new Date(year, month, 0).getDate();
    return Array.from({ length: 42 }, (_, index) => {
      const day = index - firstDay + 1;
      if (day < 1 || day > lastDate) return null;
      const date = new Date(year, month - 1, day);
      return { day, dateKey: toDateKey(date) };
    });
  }, [year, month]);

  const selectedWorkLogs = workLogsByDate.get(selectedDate) || [];
  const selectedGoals = goalsByDate.get(selectedDate) || [];

  const monthlyRecords = useMemo(
    () =>
      [...calendarData.workLogs].sort((a, b) =>
        String(b.createdAt).localeCompare(String(a.createdAt))
      ),
    [calendarData.workLogs]
  );

  const moveMonth = (offset) => {
    setCursor((previous) =>
      new Date(previous.getFullYear(), previous.getMonth() + offset, 1)
    );
  };

  const goToday = () => {
    setCursor(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(toDateKey(today));
  };

  return (
    <main className="calendar-page">
      <header className="calendar-page-header">
        <div>
          <p className="page-eyebrow">{t("calendar.eyebrow")}</p>
          <h1>{t("calendar.title")}</h1>
          <p>{t("calendar.description")}</p>
        </div>
        <button type="button" className="calendar-today-button" onClick={goToday}>
          {t("calendar.today")}
        </button>
      </header>

      {errorMessage && <div className="calendar-error">{errorMessage}</div>}

      <div className="calendar-layout">
        <section className="calendar-board-card">
          <div className="calendar-toolbar">
            <button type="button" onClick={() => moveMonth(-1)} aria-label={t("calendar.previousMonth")}>
              ‹
            </button>
            <h2>{formatMonthTitle(year, month, language)}</h2>
            <button type="button" onClick={() => moveMonth(1)} aria-label={t("calendar.nextMonth")}>
              ›
            </button>
          </div>

          <div className="calendar-weekdays">
            {t("calendar.weekdays").map((weekday) => (
              <span key={weekday}>{weekday}</span>
            ))}
          </div>

          {loading ? (
            <div className="calendar-loading">
              <div className="calendar-spinner" />
              <span>{t("common.loading")}</span>
            </div>
          ) : (
            <div className="calendar-grid">
              {cells.map((cell, index) => {
                if (!cell) {
                  return <div key={`empty-${index}`} className="calendar-cell is-empty" />;
                }

                const workLogs = workLogsByDate.get(cell.dateKey) || [];
                const goals = goalsByDate.get(cell.dateKey) || [];
                const items = [
                  ...workLogs.map((item) => ({ ...item, type: "work" })),
                  ...goals.map((item) => ({ ...item, type: "goal" })),
                ];
                const isToday = cell.dateKey === toDateKey(today);
                const isSelected = cell.dateKey === selectedDate;

                return (
                  <button
                    type="button"
                    key={cell.dateKey}
                    className={`calendar-cell ${isToday ? "is-today" : ""} ${
                      isSelected ? "is-selected" : ""
                    }`}
                    onClick={() => setSelectedDate(cell.dateKey)}
                  >
                    <span className="calendar-day-number">{cell.day}</span>
                    <div className="calendar-cell-items">
                      {items.slice(0, 3).map((item) => (
                        <span
                          key={`${item.type}-${item.id}`}
                          className={`calendar-item-chip is-${item.type} ${
                            item.overdue ? "is-overdue" : ""
                          }`}
                          title={item.title}
                        >
                          {item.title}
                        </span>
                      ))}
                      {items.length > 3 && (
                        <small>+{items.length - 3}{t("calendar.more")}</small>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <aside className="calendar-side-panel">
          <section className="calendar-side-section">
            <div className="calendar-side-head">
              <span>{t("calendar.selectedDate")}</span>
              <strong>{formatShortDate(selectedDate, language)}</strong>
            </div>

            {selectedWorkLogs.length === 0 && selectedGoals.length === 0 ? (
              <p className="calendar-side-empty">{t("calendar.selectedEmpty")}</p>
            ) : (
              <div className="calendar-selected-list">
                {selectedWorkLogs.map((workLog) => (
                  <button
                    type="button"
                    key={`selected-work-${workLog.id}`}
                    onClick={() => navigate(`/work/view/${workLog.id}`)}
                  >
                    <span className="calendar-record-type is-work">{t("calendar.workLog")}</span>
                    <strong>{workLog.title}</strong>
                  </button>
                ))}
                {selectedGoals.map((goal) => (
                  <button
                    type="button"
                    key={`selected-goal-${goal.id}`}
                    onClick={() => navigate(`/goals?goalId=${goal.id}`)}
                  >
                    <span className={`calendar-record-type is-goal ${goal.overdue ? "is-overdue" : ""}`}>
                      {goal.overdue ? t("goal.overdue") : t("calendar.goal")}
                    </span>
                    <strong>{goal.title}</strong>
                    <small>{goal.progress}%</small>
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="calendar-side-section calendar-month-records">
            <div className="calendar-side-head is-stacked">
              <strong>{t("calendar.monthlyRecords")}</strong>
              <span>{t("calendar.monthlyRecordsDescription")}</span>
            </div>

            {monthlyRecords.length === 0 ? (
              <p className="calendar-side-empty">{t("calendar.noRecords")}</p>
            ) : (
              <div className="calendar-record-list">
                {monthlyRecords.map((workLog) => {
                  const dateKey = toWorkLogDateKey(workLog.createdAt);
                  return (
                    <button
                      type="button"
                      key={workLog.id}
                      onClick={() => navigate(`/work/view/${workLog.id}`)}
                    >
                      <time>{formatShortDate(dateKey, language)}</time>
                      <strong>{workLog.title}</strong>
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        </aside>
      </div>
    </main>
  );
}

export default CalendarPage;
