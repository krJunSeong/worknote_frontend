import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useLanguage } from "../i18n/LanguageContext";
import "./CalendarPage.css";

const DRAG_MIME = "application/x-worknote-calendar";

const pad = (value) => String(value).padStart(2, "0");

const toDateKey = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const parseDateKey = (dateKey) => {
  const [year, month, day] = String(dateKey).split("-").map(Number);
  return new Date(year, month - 1, day);
};

const addDays = (dateKey, days) => {
  const date = parseDateKey(dateKey);
  date.setDate(date.getDate() + days);
  return toDateKey(date);
};

const daysBetween = (startDate, endDate) => {
  const start = parseDateKey(startDate);
  const end = parseDateKey(endDate);
  return Math.round((end.getTime() - start.getTime()) / 86400000);
};

const toWorkLogDateKey = (workLog) => {
  if (workLog?.workDate) return workLog.workDate;
  return typeof workLog?.createdAt === "string" && workLog.createdAt.length >= 10
    ? workLog.createdAt.slice(0, 10)
    : "";
};

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

const getGoalRange = (goal) => ({
  startDate: goal.startDate || goal.targetDate,
  targetDate: goal.targetDate,
});

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
  const [dragOverDate, setDragOverDate] = useState("");
  const [updatingSchedule, setUpdatingSchedule] = useState(false);
  const [quickEntry, setQuickEntry] = useState(null);
  const [quickEntrySaving, setQuickEntrySaving] = useState(false);
  const [quickEntryError, setQuickEntryError] = useState("");

  const year = cursor.getFullYear();
  const month = cursor.getMonth() + 1;
  const monthStartKey = `${year}-${pad(month)}-01`;
  const monthEndKey = toDateKey(new Date(year, month, 0));

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
      setErrorMessage(error.response?.data?.message || t("calendar.loadError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendar();
  }, [year, month]);

  useEffect(() => {
    const sameMonth = today.getFullYear() === year && today.getMonth() + 1 === month;
    setSelectedDate(sameMonth ? toDateKey(today) : `${year}-${pad(month)}-01`);
  }, [year, month, today]);

  const workLogsByDate = useMemo(() => {
    const map = new Map();
    calendarData.workLogs.forEach((workLog) => {
      const key = toWorkLogDateKey(workLog);
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
      const { startDate, targetDate } = getGoalRange(goal);
      if (!startDate || !targetDate) return;

      let current = startDate < monthStartKey ? monthStartKey : startDate;
      const last = targetDate > monthEndKey ? monthEndKey : targetDate;
      if (current > last) return;

      while (current <= last) {
        const values = map.get(current) || [];
        const rangePosition =
          startDate === targetDate
            ? "single"
            : current === startDate
              ? "start"
              : current === targetDate
                ? "end"
                : "middle";

        values.push({ ...goal, rangePosition });
        map.set(current, values);
        current = addDays(current, 1);
      }
    });

    return map;
  }, [calendarData.goals, monthEndKey, monthStartKey]);

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
        String(toWorkLogDateKey(b)).localeCompare(String(toWorkLogDateKey(a)))
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

  const startDrag = (event, payload) => {
    event.stopPropagation();
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData(DRAG_MIME, JSON.stringify(payload));
    event.dataTransfer.setData("text/plain", JSON.stringify(payload));
  };

  const readDragPayload = (event) => {
    const raw =
      event.dataTransfer.getData(DRAG_MIME) ||
      event.dataTransfer.getData("text/plain");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  const updateWorkLogDate = async (id, workDate) => {
    await api.patch(`/api/work/${id}/date`, { workDate });
  };

  const updateGoalSchedule = async (id, startDate, targetDate) => {
    if (startDate > targetDate) {
      throw new Error(t("calendar.invalidGoalRange"));
    }
    await api.patch(`/api/goals/${id}/schedule`, { startDate, targetDate });
  };

  const handleDrop = async (event, dateKey) => {
    event.preventDefault();
    event.stopPropagation();
    setDragOverDate("");

    const payload = readDragPayload(event);
    if (!payload || updatingSchedule) return;

    try {
      setUpdatingSchedule(true);
      setErrorMessage("");

      if (payload.type === "work") {
        await updateWorkLogDate(payload.id, dateKey);
      } else if (payload.type === "goal") {
        const oldStartDate = payload.startDate || payload.targetDate;
        const oldTargetDate = payload.targetDate;
        let nextStartDate = oldStartDate;
        let nextTargetDate = oldTargetDate;

        if (payload.mode === "resize-start") {
          nextStartDate = dateKey;
        } else if (payload.mode === "resize-end") {
          nextTargetDate = dateKey;
        } else {
          const duration = Math.max(0, daysBetween(oldStartDate, oldTargetDate));
          nextStartDate = dateKey;
          nextTargetDate = addDays(dateKey, duration);
        }

        await updateGoalSchedule(payload.id, nextStartDate, nextTargetDate);
      }

      await fetchCalendar();
      setSelectedDate(dateKey);
    } catch (error) {
      console.error("캘린더 일정 변경 실패:", error);
      setErrorMessage(
        error.response?.data?.message || error.message || t("calendar.moveError")
      );
    } finally {
      setUpdatingSchedule(false);
    }
  };

  const openQuickEntry = (dateKey) => {
    setSelectedDate(dateKey);
    setQuickEntry({ date: dateKey, title: "", content: "" });
    setQuickEntryError("");
  };

  const closeQuickEntry = () => {
    if (quickEntrySaving) return;
    setQuickEntry(null);
    setQuickEntryError("");
  };

  const saveQuickEntry = async (event) => {
    event.preventDefault();
    if (!quickEntry?.title.trim()) {
      setQuickEntryError(t("workLog.titleRequired"));
      return;
    }
    if (!quickEntry?.content.trim()) {
      setQuickEntryError(t("workLog.contentRequired"));
      return;
    }

    try {
      setQuickEntrySaving(true);
      setQuickEntryError("");
      await api.post("/api/work", {
        userId: Number(localStorage.getItem("userId")),
        title: quickEntry.title.trim(),
        content: quickEntry.content.trim(),
        language,
        workDate: quickEntry.date,
      });
      setQuickEntry(null);
      await fetchCalendar();
    } catch (error) {
      console.error("캘린더 빠른 업무일지 저장 실패:", error);
      const message =
        error.response?.data?.message || error.response?.data?.error || t("workLog.saveError");
      setQuickEntryError(message);
    } finally {
      setQuickEntrySaving(false);
    }
  };

  const renderWorkChip = (workLog) => (
    <div
      key={`work-${workLog.id}`}
      className="calendar-item-chip is-work is-draggable"
      draggable
      title={workLog.title}
      onDragStart={(event) =>
        startDrag(event, { type: "work", id: workLog.id })
      }
      onDoubleClick={(event) => event.stopPropagation()}
      onClick={(event) => {
        event.stopPropagation();
        navigate(`/work/view/${workLog.id}`);
      }}
    >
      <span className="calendar-drag-grip" aria-hidden="true">⋮⋮</span>
      <span className="calendar-chip-title">{workLog.title}</span>
    </div>
  );

  const renderGoalChip = (goal) => {
    const { startDate, targetDate } = getGoalRange(goal);
    const showStartHandle = goal.rangePosition === "start" || goal.rangePosition === "single";
    const showEndHandle = goal.rangePosition === "end" || goal.rangePosition === "single";
    const isCompleted = goal.status === "COMPLETED" || Number(goal.progress || 0) >= 100;

    return (
      <div
        key={`goal-${goal.id}`}
        className={`calendar-item-chip is-goal is-draggable is-range-${goal.rangePosition} ${goal.overdue ? "is-overdue" : ""} ${isCompleted ? "is-completed" : ""}`}
        draggable
        title={goal.title}
        onDragStart={(event) =>
          startDrag(event, {
            type: "goal",
            id: goal.id,
            mode: "move",
            startDate,
            targetDate,
          })
        }
        onDoubleClick={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation();
          navigate(`/goals?goalId=${goal.id}`);
        }}
      >
        {showStartHandle && (
          <span
            className="calendar-resize-handle is-start"
            draggable
            title={t("goal.startDateLabel")}
            onClick={(event) => event.stopPropagation()}
            onDragStart={(event) => {
              event.stopPropagation();
              startDrag(event, {
                type: "goal",
                id: goal.id,
                mode: "resize-start",
                startDate,
                targetDate,
              });
            }}
          />
        )}
        {isCompleted && <span className="calendar-complete-mark" aria-hidden="true">✓</span>}
        <span className="calendar-chip-title">{goal.title}</span>
        {showEndHandle && (
          <span
            className="calendar-resize-handle is-end"
            draggable
            title={t("goal.targetDateLabel")}
            onClick={(event) => event.stopPropagation()}
            onDragStart={(event) => {
              event.stopPropagation();
              startDrag(event, {
                type: "goal",
                id: goal.id,
                mode: "resize-end",
                startDate,
                targetDate,
              });
            }}
          />
        )}
      </div>
    );
  };

  return (
    <main className="calendar-page">
      <header className="calendar-page-header">
        <div>
          <p className="page-eyebrow">{t("calendar.eyebrow")}</p>
          <h1>{t("calendar.title")}</h1>
          <p>{t("calendar.description")}</p>
          <div className="calendar-help-lines">
            <span>{t("calendar.dragHint")}</span>
            <span>{t("calendar.doubleClickHint")}</span>
          </div>
        </div>
        <button type="button" className="calendar-today-button" onClick={goToday}>
          {t("calendar.today")}
        </button>
      </header>

      {errorMessage && <div className="calendar-error">{errorMessage}</div>}

      <div className="calendar-layout">
        <section className={`calendar-board-card ${updatingSchedule ? "is-updating" : ""}`}>
          <div className="calendar-toolbar">
            <button type="button" onClick={() => moveMonth(-1)} aria-label={t("calendar.previousMonth")}>‹</button>
            <h2>{formatMonthTitle(year, month, language)}</h2>
            <button type="button" onClick={() => moveMonth(1)} aria-label={t("calendar.nextMonth")}>›</button>
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
                const isToday = cell.dateKey === toDateKey(today);
                const isSelected = cell.dateKey === selectedDate;
                const isDragOver = cell.dateKey === dragOverDate;
                const visibleCount = workLogs.length + goals.length;
                const shownCount = Math.min(workLogs.length, 2) + Math.min(goals.length, 2);

                return (
                  <div
                    key={cell.dateKey}
                    className={`calendar-cell ${isToday ? "is-today" : ""} ${isSelected ? "is-selected" : ""} ${isDragOver ? "is-drag-over" : ""}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedDate(cell.dateKey)}
                    onDoubleClick={() => openQuickEntry(cell.dateKey)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedDate(cell.dateKey);
                      }
                    }}
                    onDragOver={(event) => {
                      event.preventDefault();
                      event.dataTransfer.dropEffect = "move";
                      setDragOverDate(cell.dateKey);
                    }}
                    onDragLeave={() => {
                      if (dragOverDate === cell.dateKey) setDragOverDate("");
                    }}
                    onDrop={(event) => handleDrop(event, cell.dateKey)}
                  >
                    <span className="calendar-day-number">{cell.day}</span>
                    <div className="calendar-cell-items">
                      {goals.slice(0, 2).map(renderGoalChip)}
                      {workLogs.slice(0, 2).map(renderWorkChip)}
                      {visibleCount > shownCount && (
                        <small>+{visibleCount - shownCount}{t("calendar.more")}</small>
                      )}
                    </div>
                  </div>
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
                {selectedGoals.map((goal) => {
                  const isCompleted = goal.status === "COMPLETED" || Number(goal.progress || 0) >= 100;
                  return (
                    <button
                      type="button"
                      key={`selected-goal-${goal.id}`}
                      className={isCompleted ? "is-completed" : ""}
                      onClick={() => navigate(`/goals?goalId=${goal.id}`)}
                    >
                      <span className={`calendar-record-type is-goal ${goal.overdue ? "is-overdue" : ""} ${isCompleted ? "is-completed" : ""}`}>
                        {isCompleted ? `✓ ${t("goal.completed")}` : goal.overdue ? t("goal.overdue") : t("calendar.goal")}
                      </span>
                      <strong>{goal.title}</strong>
                      <small>{goal.progress}%</small>
                    </button>
                  );
                })}
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
                  const dateKey = toWorkLogDateKey(workLog);
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

      {quickEntry && (
        <div className="calendar-quick-modal-backdrop" onMouseDown={closeQuickEntry}>
          <section
            className="calendar-quick-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="calendar-quick-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="calendar-quick-modal-head">
              <div>
                <span>{formatShortDate(quickEntry.date, language)}</span>
                <h2 id="calendar-quick-title">{t("calendar.quickEntryTitle")}</h2>
              </div>
              <button type="button" onClick={closeQuickEntry} disabled={quickEntrySaving}>×</button>
            </div>
            <p className="calendar-quick-description">{t("calendar.quickEntryDescription")}</p>

            <form onSubmit={saveQuickEntry}>
              <label>
                <span>{t("calendar.quickEntryDate")}</span>
                <input type="date" value={quickEntry.date} readOnly />
              </label>
              <label>
                <span>{t("workLog.titleLabel")}</span>
                <input
                  autoFocus
                  type="text"
                  maxLength={200}
                  value={quickEntry.title}
                  onChange={(event) => {
                    setQuickEntry((previous) => ({ ...previous, title: event.target.value }));
                    setQuickEntryError("");
                  }}
                  placeholder={t("workLog.titlePlaceholder")}
                  disabled={quickEntrySaving}
                />
              </label>
              <label>
                <span>{t("workLog.contentLabel")}</span>
                <textarea
                  rows={7}
                  maxLength={20000}
                  value={quickEntry.content}
                  onChange={(event) => {
                    setQuickEntry((previous) => ({ ...previous, content: event.target.value }));
                    setQuickEntryError("");
                  }}
                  placeholder={t("workLog.editorContentPlaceholder")}
                  disabled={quickEntrySaving}
                />
              </label>

              {quickEntryError && <div className="calendar-quick-error">{quickEntryError}</div>}

              <div className="calendar-quick-actions">
                <button type="button" onClick={closeQuickEntry} disabled={quickEntrySaving}>
                  {t("calendar.quickEntryCancel")}
                </button>
                <button type="submit" className="is-primary" disabled={quickEntrySaving}>
                  {quickEntrySaving ? t("calendar.quickEntrySaving") : t("calendar.quickEntrySave")}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}

export default CalendarPage;
