import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import api from "../api/api";
import LanguageSelector from "../components/LanguageSelector";
import { useLanguage } from "../i18n/LanguageContext";
import {
  getDifficultyClassName,
  normalizeDifficulty,
  translateDifficulty,
} from "../utils/difficulty";
import "./DashboardPage.css";

const DIFFICULTY_COLORS = {
  초급: "#22c55e",
  중급: "#f59e0b",
  고급: "#ef4444",
  미분류: "#94a3b8",
};

const DIFFICULTY_ORDER = [
  "초급",
  "중급",
  "고급",
  "미분류",
];

const formatRecentDate = (dateText, language) => {
  if (!dateText) {
    return "";
  }

  const parsedDate = new Date(dateText);

  if (Number.isNaN(parsedDate.getTime())) {
    return dateText;
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
  ).format(parsedDate);
};

function DashboardPage() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const userId = Number(localStorage.getItem("userId"));

  useEffect(() => {
    if (!userId) {
      navigate("/login", { replace: true });
      return;
    }

    fetchDashboard();
  }, [userId, navigate]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await api.get(
        `/api/dashboard/${userId}`
      );

      setDashboard(response.data);
    } catch (error) {
      console.error("대시보드 조회 실패:", error);
      setErrorMessage(t("dashboard.loadError"));
    } finally {
      setLoading(false);
    }
  };

  const normalizedDifficultyCounts = useMemo(() => {
    const initialCounts = {
      초급: 0,
      중급: 0,
      고급: 0,
      미분류: 0,
    };

    const sourceCounts =
      dashboard?.difficultyCounts || {};

    Object.entries(sourceCounts).forEach(
      ([difficulty, count]) => {
        const normalized =
          normalizeDifficulty(difficulty);

        initialCounts[normalized] += Number(count) || 0;
      }
    );

    return initialCounts;
  }, [dashboard]);

  const difficultyData = useMemo(() => {
    return DIFFICULTY_ORDER.map((difficulty) => ({
      key: difficulty,
      name: translateDifficulty(difficulty, t),
      value:
        normalizedDifficultyCounts[difficulty] || 0,
    }));
  }, [normalizedDifficultyCounts, t, language]);

  const recentDailyCounts = useMemo(() => {
    if (!Array.isArray(dashboard?.recentDailyCounts)) {
      return [];
    }

    return dashboard.recentDailyCounts.map((item) => ({
      ...item,
      count: Number(item.count) || 0,
    }));
  }, [dashboard]);

  const totalRecentCount = useMemo(() => {
    return recentDailyCounts.reduce(
      (sum, item) => sum + item.count,
      0
    );
  }, [recentDailyCounts]);

  const topTags = useMemo(() => {
    if (!Array.isArray(dashboard?.topTags)) {
      return [];
    }

    return dashboard.topTags.map((item) => ({
      tag: item.tag,
      count: Number(item.count) || 0,
    }));
  }, [dashboard]);

  const maxTagCount = useMemo(() => {
    if (topTags.length === 0) {
      return 1;
    }

    return Math.max(
      ...topTags.map((item) => item.count),
      1
    );
  }, [topTags]);

  const recentWorkLogs = useMemo(() => {
    if (!Array.isArray(dashboard?.recentWorkLogs)) {
      return [];
    }

    return dashboard.recentWorkLogs;
  }, [dashboard]);

  const renderCountText = (count) => {
    return language === "ja"
      ? `${count}${t("dashboard.usageCount")}`
      : `${count}${t("dashboard.usageCount")}`;
  };

  if (loading) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-status">
          <div className="dashboard-spinner" />
          <p>{t("common.loading")}</p>
        </div>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-error">
          <p>{errorMessage}</p>

          <button type="button" onClick={fetchDashboard}>
            {t("common.retry")}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-heading">
          <p className="dashboard-label">
            {t("dashboard.eyebrow")}
          </p>

          <h1>{t("dashboard.title")}</h1>

          <p>{t("dashboard.description")}</p>
        </div>

        <div className="dashboard-header-actions">
          <LanguageSelector />

          <Link
            to="/reports/ai"
            className="dashboard-report-link"
          >
            {t("navigation.aiReport")}
          </Link>

          <Link
            to="/work"
            className="dashboard-work-link"
          >
            {t("navigation.workLog")}
          </Link>

          <button
            className="dashboard-refresh-button"
            type="button"
            onClick={fetchDashboard}
          >
            {t("common.refresh")}
          </button>
          
        </div>
      </header>

      <section className="summary-card-grid">
        <article className="summary-card">
          <span>{t("dashboard.totalWorkLogs")}</span>

          <strong>{dashboard?.totalCount || 0}</strong>

          <p>{t("dashboard.totalDescription")}</p>
        </article>

        <article className="summary-card">
          <span>{t("dashboard.recentSevenDays")}</span>

          <strong>{totalRecentCount}</strong>

          <p>{t("dashboard.recentDescription")}</p>
        </article>

        <article className="summary-card">
          <span>
            {t("dashboard.mostUsedTechnology")}
          </span>

          <strong className="summary-card-tech">
            {topTags[0]?.tag ||
              t("dashboard.noTagData")}
          </strong>

          <p>
            {topTags[0]
              ? renderCountText(topTags[0].count)
              : t("dashboard.noTagData")}
          </p>
        </article>

        <article className="summary-card">
          <span>{t("dashboard.advancedWork")}</span>

          <strong>
            {normalizedDifficultyCounts.고급 || 0}
          </strong>

          <p>
            {t("dashboard.advancedDescription")}
          </p>
        </article>
      </section>

      <section className="dashboard-chart-grid">
        <article className="dashboard-panel">
          <header className="panel-header">
            <div>
              <h2>
                {t("dashboard.recentChartTitle")}
              </h2>

              <p>
                {t(
                  "dashboard.recentChartDescription"
                )}
              </p>
            </div>
          </header>

          <div className="chart-container">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={recentDailyCounts}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip
                  formatter={(value) => [
                    value,
                    t("dashboard.workCount"),
                  ]}
                />

                <Bar
                  dataKey="count"
                  name={t("dashboard.workCount")}
                  fill="#2563eb"
                  radius={[7, 7, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="dashboard-panel">
          <header className="panel-header">
            <div>
              <h2>
                {t("dashboard.difficultyTitle")}
              </h2>

              <p>
                {t(
                  "dashboard.difficultyDescription"
                )}
              </p>
            </div>
          </header>

          <div className="difficulty-chart-layout">
            <div className="difficulty-chart">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>
                  <Pie
                    data={difficultyData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={57}
                    outerRadius={86}
                    paddingAngle={3}
                  >
                    {difficultyData.map((item) => (
                      <Cell
                        key={item.key}
                        fill={
                          DIFFICULTY_COLORS[item.key]
                        }
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="difficulty-legend">
              {difficultyData.map((item) => (
                <div
                  className="difficulty-legend-item"
                  key={item.key}
                >
                  <span
                    className="legend-color"
                    style={{
                      backgroundColor:
                        DIFFICULTY_COLORS[item.key],
                    }}
                  />

                  <span>{item.name}</span>

                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </article>
      </section>

      <section className="dashboard-lower-grid">
        <article className="dashboard-panel">
          <header className="panel-header">
            <div>
              <h2>
                {t("dashboard.topTagsTitle")}
              </h2>

              <p>
                {t(
                  "dashboard.topTagsDescription"
                )}
              </p>
            </div>
          </header>

          {topTags.length > 0 ? (
            <div className="top-tag-list">
              {topTags.map((item, index) => (
                <div
                  className="top-tag-item"
                  key={item.tag}
                >
                  <div className="top-tag-info">
                    <span className="top-tag-rank">
                      {index + 1}
                    </span>

                    <span className="top-tag-name">
                      {item.tag}
                    </span>

                    <strong>
                      {renderCountText(item.count)}
                    </strong>
                  </div>

                  <div className="top-tag-progress">
                    <div
                      className="top-tag-progress-value"
                      style={{
                        width: `${
                          (item.count / maxTagCount) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="panel-empty">
              {t("dashboard.noTagData")}
            </div>
          )}
        </article>

        <article className="dashboard-panel">
          <header className="panel-header">
            <div>
              <h2>
                {t("dashboard.recentWorkTitle")}
              </h2>

              <p>
                {t(
                  "dashboard.recentWorkDescription"
                )}
              </p>
            </div>
          </header>

          {recentWorkLogs.length > 0 ? (
            <div className="recent-work-list">
              {recentWorkLogs.map((workLog) => {
                const difficultyClass =
                  getDifficultyClassName(
                    workLog.difficulty
                  );

                return (
                  <div
                    className="recent-work-item"
                    key={workLog.id}
                  >
                    <div>
                      <h3>{workLog.title}</h3>

                      <time>
                        {formatRecentDate(
                          workLog.createdAt,
                          language
                        )}
                      </time>
                    </div>

                    <span
                      className={`recent-difficulty difficulty-${difficultyClass}`}
                    >
                      {translateDifficulty(
                        workLog.difficulty,
                        t
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="panel-empty">
              {t("common.noData")}
            </div>
          )}
        </article>
      </section>
    </main>
  );
}

export default DashboardPage;