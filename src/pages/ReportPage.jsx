import { useMemo, useState } from "react";
import {
  downloadAiReportPdf,
  generateAiReport,
} from "../api/reportApi";
import { useLanguage } from "../i18n/LanguageContext";
import "./ReportPage.css";

function ReportIcon({ name, size = 22 }) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  const paths = {
    sparkles: (
      <>
        <path d="m12 3 1.2 3.4L16.5 8l-3.3 1.4L12 13l-1.2-3.6L7.5 8l3.3-1.6L12 3Z" />
        <path d="m18.5 13 .8 2.1 2.2.9-2.2.9-.8 2.1-.8-2.1-2.2-.9 2.2-.9.8-2.1Z" />
        <path d="m5 14 .7 1.8 1.8.7-1.8.8L5 19l-.7-1.7-1.8-.8 1.8-.7L5 14Z" />
      </>
    ),
    download: (
      <>
        <path d="M12 3v11" />
        <path d="m8 10 4 4 4-4" />
        <path d="M5 20h14" />
      </>
    ),
    refresh: (
      <>
        <path d="M20 7v5h-5" />
        <path d="M4 17v-5h5" />
        <path d="M6.1 8.4A7 7 0 0 1 18.6 7L20 12" />
        <path d="M17.9 15.6A7 7 0 0 1 5.4 17L4 12" />
      </>
    ),
    file: (
      <>
        <path d="M6 3h8l4 4v14H6z" />
        <path d="M14 3v5h5" />
        <path d="M9 13h6M9 17h6" />
      </>
    ),
    chart: (
      <>
        <path d="M4 20V10" />
        <path d="M10 20V4" />
        <path d="M16 20v-7" />
        <path d="M22 20H2" />
      </>
    ),
    code: (
      <>
        <path d="m9 18-6-6 6-6" />
        <path d="m15 6 6 6-6 6" />
      </>
    ),
    trophy: (
      <>
        <path d="M8 4h8v4a4 4 0 0 1-8 0V4Z" />
        <path d="M8 6H5a2 2 0 0 0 2 4h1" />
        <path d="M16 6h3a2 2 0 0 1-2 4h-1" />
        <path d="M12 12v5" />
        <path d="M8 21h8" />
        <path d="M9 17h6" />
      </>
    ),
    arrow: (
      <>
        <path d="M12 19V5" />
        <path d="m6 11 6-6 6 6" />
      </>
    ),
  };

  return <svg {...props}>{paths[name] || paths.file}</svg>;
}

const toArray = (value) => (Array.isArray(value) ? value : []);

const toEntries = (value) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return [];
  }

  return Object.entries(value);
};

const getErrorMessage = (error, fallback) => {
  const serverMessage =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.response?.data;

  return typeof serverMessage === "string" && serverMessage.trim()
    ? serverMessage
    : fallback;
};

const getFileName = (contentDisposition, language) => {
  if (contentDisposition) {
    const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
    if (utf8Match?.[1]) {
      return decodeURIComponent(utf8Match[1]);
    }

    const basicMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
    if (basicMatch?.[1]) {
      return basicMatch[1];
    }
  }

  return language === "ja"
    ? "worknote-ai-project-report.pdf"
    : "worknote-ai-project-report.pdf";
};

function ReportPage() {
  const { language, t } = useLanguage();
  const [report, setReport] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const statistics = report?.statistics || {};

  const difficultyEntries = useMemo(
    () => toEntries(statistics.difficultyCounts),
    [statistics.difficultyCounts]
  );

  const tagEntries = useMemo(
    () =>
      toEntries(statistics.tagCounts).sort(
        ([, firstCount], [, secondCount]) =>
          Number(secondCount) - Number(firstCount)
      ),
    [statistics.tagCounts]
  );

  const implementedFeatures = toArray(report?.implementedFeatures);
  const futureImprovements = toArray(report?.futureImprovements);

  const generateReport = async () => {
    try {
      setGenerating(true);
      setErrorMessage("");

      const result = await generateAiReport(language);
      setReport(result);
    } catch (error) {
      console.error("AI report generation failed:", error);
      setErrorMessage(getErrorMessage(error, t("report.generateError")));
    } finally {
      setGenerating(false);
    }
  };

  const downloadPdf = async () => {
    if (!report || downloading) {
      return;
    }

    try {
      setDownloading(true);
      setErrorMessage("");

      const response = await downloadAiReportPdf(report);
      const blob = new Blob([response.data], {
        type: "application/pdf",
      });
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");

      anchor.href = objectUrl;
      anchor.download = getFileName(
        response.headers?.["content-disposition"],
        language
      );
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error("PDF download failed:", error);
      setErrorMessage(getErrorMessage(error, t("report.downloadError")));
    } finally {
      setDownloading(false);
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return t("report.noPeriod");
    }

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) {
      return String(dateValue);
    }

    return new Intl.DateTimeFormat(language === "ja" ? "ja-JP" : "ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  };

  const workPeriod =
    statistics.startDate || statistics.endDate
      ? `${formatDate(statistics.startDate)} — ${formatDate(
          statistics.endDate
        )}`
      : t("report.noPeriod");

  return (
    <main className="report-page">
      <header className="report-hero">
        <div className="report-hero-copy">
          <p className="report-eyebrow">{t("report.eyebrow")}</p>
          <h1>{t("report.title")}</h1>
          <p>{t("report.description")}</p>
        </div>

        {report && (
          <div className="report-hero-actions">
            <button
              type="button"
              className="report-secondary-button"
              onClick={generateReport}
              disabled={generating || downloading}
            >
              <ReportIcon name="refresh" />
              {generating
                ? t("report.generating")
                : t("report.regenerateButton")}
            </button>

            <button
              type="button"
              className="report-primary-button"
              onClick={downloadPdf}
              disabled={generating || downloading}
            >
              <ReportIcon name="download" />
              {downloading
                ? t("report.downloading")
                : t("report.downloadButton")}
            </button>
          </div>
        )}
      </header>

      {errorMessage && (
        <div className="report-error" role="alert">
          <span>{errorMessage}</span>
          <button type="button" onClick={() => setErrorMessage("")}>
            {t("common.close")}
          </button>
        </div>
      )}

      {!report && !generating && (
        <section className="report-start-card">
          <div className="report-start-visual" aria-hidden="true">
            <div className="report-start-orbit report-start-orbit-one" />
            <div className="report-start-orbit report-start-orbit-two" />
            <div className="report-start-icon">
              <ReportIcon name="sparkles" size={42} />
            </div>
          </div>

          <div className="report-start-content">
            <p className="report-card-label">AI REPORT BUILDER</p>
            <h2>{t("report.startTitle")}</h2>
            <p>{t("report.startDescription")}</p>

            <div className="report-start-items">
              <span>
                <ReportIcon name="chart" />
                {t("report.startItemStatistics")}
              </span>
              <span>
                <ReportIcon name="code" />
                {t("report.startItemFeatures")}
              </span>
              <span>
                <ReportIcon name="trophy" />
                {t("report.startItemAchievements")}
              </span>
              <span>
                <ReportIcon name="arrow" />
                {t("report.startItemImprovements")}
              </span>
            </div>

            <button
              type="button"
              className="report-primary-button report-generate-button"
              onClick={generateReport}
            >
              <ReportIcon name="sparkles" />
              {t("report.generateButton")}
            </button>
          </div>
        </section>
      )}

      {generating && (
        <section className="report-generating-card" aria-live="polite">
          <div className="report-ai-loader">
            <span />
            <span />
            <span />
          </div>
          <div>
            <h2>{t("report.generatingTitle")}</h2>
            <p>{t("report.generatingDescription")}</p>
          </div>
        </section>
      )}

      {report && !generating && (
        <div className="report-preview">
          <section className="report-preview-heading">
            <div>
              <p className="report-card-label">REPORT PREVIEW</p>
              <h2>{t("report.previewTitle")}</h2>
              <p>{t("report.previewDescription")}</p>
            </div>
            <div className="report-preview-file">
              <ReportIcon name="file" />
              <span>PDF</span>
            </div>
          </section>

          <section className="report-stat-grid">
            <article className="report-stat-card">
              <span className="report-stat-icon blue">
                <ReportIcon name="file" />
              </span>
              <div>
                <p>{t("report.totalWorkLogs")}</p>
                <strong>{statistics.totalWorkLogs ?? 0}</strong>
                <span>{t("report.totalWorkLogsDescription")}</span>
              </div>
            </article>

            <article className="report-stat-card">
              <span className="report-stat-icon green">
                <ReportIcon name="chart" />
              </span>
              <div>
                <p>{t("report.workPeriod")}</p>
                <strong className="report-stat-text-value">{workPeriod}</strong>
                <span>{t("report.workPeriodDescription")}</span>
              </div>
            </article>

            <article className="report-stat-card">
              <span className="report-stat-icon violet">
                <ReportIcon name="sparkles" />
              </span>
              <div>
                <p>{t("report.averageDifficulty")}</p>
                <strong>
                  {statistics.averageDifficulty ?? "-"}
                  {statistics.averageDifficulty !== undefined ? " / 3.0" : ""}
                </strong>
                <span>{t("report.averageDifficultyDescription")}</span>
              </div>
            </article>

            <article className="report-stat-card">
              <span className="report-stat-icon orange">
                <ReportIcon name="code" />
              </span>
              <div>
                <p>{t("report.technologyCount")}</p>
                <strong>{tagEntries.length}</strong>
                <span>{t("report.technologyCountDescription")}</span>
              </div>
            </article>
          </section>

          <section className="report-section report-summary-section">
            <div className="report-section-heading">
              <span className="report-section-number">01</span>
              <div>
                <h3>{t("report.workSummary")}</h3>
                <p>{t("report.workSummaryDescription")}</p>
              </div>
            </div>
            <div className="report-rich-text">
              {report.workSummary || t("common.noData")}
            </div>
          </section>

          <section className="report-section">
            <div className="report-section-heading">
              <span className="report-section-number">02</span>
              <div>
                <h3>{t("report.statistics")}</h3>
                <p>{t("report.statisticsDescription")}</p>
              </div>
            </div>

            <div className="report-statistics-grid">
              <div className="report-data-panel">
                <h4>{t("report.difficultyCounts")}</h4>
                {difficultyEntries.length > 0 ? (
                  <div className="report-difficulty-list">
                    {difficultyEntries.map(([label, count]) => (
                      <div key={label}>
                        <span>{label}</span>
                        <strong>{count}</strong>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="report-empty-text">{t("common.noData")}</p>
                )}
              </div>

              <div className="report-data-panel">
                <h4>{t("report.technologyTags")}</h4>
                {tagEntries.length > 0 ? (
                  <div className="report-tag-cloud">
                    {tagEntries.map(([tag, count]) => (
                      <span key={tag}>
                        {tag}
                        <b>{count}</b>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="report-empty-text">{t("common.noData")}</p>
                )}
              </div>
            </div>
          </section>

          <section className="report-section">
            <div className="report-section-heading">
              <span className="report-section-number">03</span>
              <div>
                <h3>{t("report.implementedFeatures")}</h3>
                <p>{t("report.implementedFeaturesDescription")}</p>
              </div>
            </div>

            {implementedFeatures.length > 0 ? (
              <div className="report-feature-grid">
                {implementedFeatures.map((feature, index) => (
                  <article
                    className="report-feature-card"
                    key={`${feature?.category || "feature"}-${index}`}
                  >
                    <div className="report-feature-card-top">
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <ReportIcon name="code" />
                    </div>
                    <h4>
                      {feature?.category || t("report.uncategorizedFeature")}
                    </h4>
                    {toArray(feature?.features).length > 0 && (
                      <ul>
                        {feature.features.map((item, featureIndex) => (
                          <li key={`${item}-${featureIndex}`}>{item}</li>
                        ))}
                      </ul>
                    )}
                    {feature?.description && <p>{feature.description}</p>}
                  </article>
                ))}
              </div>
            ) : (
              <div className="report-empty-block">{t("common.noData")}</div>
            )}
          </section>

          <section className="report-two-column-sections">
            <article className="report-section report-half-section">
              <div className="report-section-heading compact">
                <span className="report-section-number">04</span>
                <div>
                  <h3>{t("report.difficultyAnalysis")}</h3>
                  <p>{t("report.difficultyAnalysisDescription")}</p>
                </div>
              </div>
              <div className="report-rich-text">
                {report.difficultyAnalysis || t("common.noData")}
              </div>
            </article>

            <article className="report-section report-half-section">
              <div className="report-section-heading compact">
                <span className="report-section-number">05</span>
                <div>
                  <h3>{t("report.projectAchievements")}</h3>
                  <p>{t("report.projectAchievementsDescription")}</p>
                </div>
              </div>
              <div className="report-rich-text">
                {report.projectAchievements || t("common.noData")}
              </div>
            </article>
          </section>

          <section className="report-section report-improvement-section">
            <div className="report-section-heading">
              <span className="report-section-number">06</span>
              <div>
                <h3>{t("report.futureImprovements")}</h3>
                <p>{t("report.futureImprovementsDescription")}</p>
              </div>
            </div>

            {futureImprovements.length > 0 ? (
              <ol className="report-improvement-list">
                {futureImprovements.map((item, index) => (
                  <li key={`${item}-${index}`}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <p>{item}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="report-empty-block">{t("common.noData")}</div>
            )}
          </section>

          <div className="report-bottom-action">
            <button
              type="button"
              className="report-primary-button"
              onClick={downloadPdf}
              disabled={downloading}
            >
              <ReportIcon name="download" />
              {downloading
                ? t("report.downloading")
                : t("report.downloadButton")}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default ReportPage;
