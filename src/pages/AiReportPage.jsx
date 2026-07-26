import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  downloadAiReportPdf,
  generateAiReport,
} from "../api/reportApi";
import LanguageSelector from "../components/LanguageSelector";
import { useLanguage } from "../i18n/LanguageContext";
import "./AiReportPage.css";

const DIFFICULTY_ORDER = [
  "초급",
  "중급",
  "고급",
  "미분류",
];

const TAG_COLORS = [
  "blue",
  "violet",
  "green",
  "orange",
  "rose",
];

const getErrorMessage = (error, fallbackMessage) => {
  const responseData = error?.response?.data;

  if (typeof responseData === "string") {
    return responseData;
  }

  if (
    responseData &&
    typeof responseData.message === "string"
  ) {
    return responseData.message;
  }

  return fallbackMessage;
};

const getDownloadFilename = (
  contentDisposition,
  language
) => {
  if (contentDisposition) {
    const utf8FilenameMatch = contentDisposition.match(
      /filename\*=UTF-8''([^;]+)/
    );

    if (utf8FilenameMatch?.[1]) {
      return decodeURIComponent(utf8FilenameMatch[1]);
    }

    const filenameMatch = contentDisposition.match(
      /filename="?([^"]+)"?/
    );

    if (filenameMatch?.[1]) {
      return filenameMatch[1];
    }
  }

  return language === "ja"
    ? "ai-project-report.pdf"
    : "ai-project-report.pdf";
};

function AiReportPage() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  const [report, setReport] = useState(null);
  const [generating, setGenerating] =
    useState(false);
  const [downloading, setDownloading] =
    useState(false);
  const [errorMessage, setErrorMessage] =
    useState("");

  const accessToken =
    localStorage.getItem("accessToken");

  useEffect(() => {
    if (!accessToken) {
      navigate("/login", { replace: true });
    }
  }, [accessToken, navigate]);

  const difficultyCounts = useMemo(() => {
    const sourceCounts =
      report?.statistics?.difficultyCounts || {};

    return DIFFICULTY_ORDER.map((difficulty) => ({
      difficulty,
      count: Number(sourceCounts[difficulty]) || 0,
    }));
  }, [report]);

  const tagCounts = useMemo(() => {
    const sourceCounts =
      report?.statistics?.tagCounts || {};

    return Object.entries(sourceCounts)
      .map(([tag, count]) => ({
        tag,
        count: Number(count) || 0,
      }))
      .sort((first, second) => second.count - first.count);
  }, [report]);

  const formatDateRange = () => {
    const startDate = report?.statistics?.startDate;
    const endDate = report?.statistics?.endDate;

    if (!startDate && !endDate) {
      return t("report.noPeriod");
    }

    if (startDate === endDate) {
      return startDate;
    }

    return `${startDate || "-"} ~ ${endDate || "-"}`;
  };

  const handleGenerateReport = async () => {
    try {
      setGenerating(true);
      setErrorMessage("");

      const generatedReport =
        await generateAiReport(language);

      setReport(generatedReport);
    } catch (error) {
      console.error("AI 보고서 생성 실패:", error);

      setErrorMessage(
        getErrorMessage(
          error,
          t("report.generateError")
        )
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!report) {
      return;
    }

    try {
      setDownloading(true);
      setErrorMessage("");

      const response =
        await downloadAiReportPdf(report);

      const contentType =
        response.headers["content-type"] ||
        "application/pdf";

      const pdfBlob = new Blob([response.data], {
        type: contentType,
      });

      const downloadUrl =
        window.URL.createObjectURL(pdfBlob);

      const downloadLink =
        document.createElement("a");

      downloadLink.href = downloadUrl;
      downloadLink.download = getDownloadFilename(
        response.headers["content-disposition"],
        language
      );

      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();

      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("PDF 다운로드 실패:", error);

      setErrorMessage(
        getErrorMessage(
          error,
          t("report.downloadError")
        )
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <main className="ai-report-page">
      <header className="ai-report-header">
        <div className="ai-report-heading">
          <p className="ai-report-eyebrow">
            {t("report.eyebrow")}
          </p>

          <h1>{t("report.title")}</h1>

          <p>{t("report.description")}</p>
        </div>

        <div className="ai-report-header-actions">
          <LanguageSelector />

          <Link
            to="/dashboard"
            className="ai-report-secondary-link"
          >
            {t("navigation.dashboard")}
          </Link>

          <Link
            to="/work"
            className="ai-report-secondary-link"
          >
            {t("navigation.workLog")}
          </Link>
        </div>
      </header>

      {!report && (
        <section className="ai-report-start-card">
          <div className="ai-report-start-icon">
            AI
          </div>

          <div className="ai-report-start-content">
            <h2>{t("report.startTitle")}</h2>

            <p>{t("report.startDescription")}</p>

            <ul>
              <li>{t("report.startItemStatistics")}</li>
              <li>{t("report.startItemFeatures")}</li>
              <li>{t("report.startItemAchievements")}</li>
              <li>{t("report.startItemImprovements")}</li>
            </ul>
          </div>

          <button
            type="button"
            className="ai-report-generate-button"
            onClick={handleGenerateReport}
            disabled={generating}
          >
            {generating
              ? t("report.generating")
              : t("report.generateButton")}
          </button>
        </section>
      )}

      {generating && !report && (
        <section className="ai-report-loading-card">
          <div className="ai-report-spinner" />

          <strong>{t("report.generatingTitle")}</strong>

          <p>{t("report.generatingDescription")}</p>
        </section>
      )}

      {errorMessage && (
        <div className="ai-report-error">
          <span>{errorMessage}</span>

          <button
            type="button"
            onClick={() => setErrorMessage("")}
          >
            {t("common.close")}
          </button>
        </div>
      )}

      {report && (
        <>
          <section className="ai-report-toolbar">
            <div>
              <strong>{t("report.previewTitle")}</strong>

              <span>
                {t("report.previewDescription")}
              </span>
            </div>

            <div className="ai-report-toolbar-actions">
              <button
                type="button"
                className="ai-report-regenerate-button"
                onClick={handleGenerateReport}
                disabled={generating || downloading}
              >
                {generating
                  ? t("report.generating")
                  : t("report.regenerateButton")}
              </button>

              <button
                type="button"
                className="ai-report-download-button"
                onClick={handleDownloadPdf}
                disabled={generating || downloading}
              >
                {downloading
                  ? t("report.downloading")
                  : t("report.downloadButton")}
              </button>
            </div>
          </section>

          <section className="ai-report-stat-grid">
            <article className="ai-report-stat-card">
              <span>{t("report.totalWorkLogs")}</span>

              <strong>
                {report.statistics?.totalWorkLogs || 0}
              </strong>

              <p>{t("report.totalWorkLogsDescription")}</p>
            </article>

            <article className="ai-report-stat-card">
              <span>{t("report.workPeriod")}</span>

              <strong className="ai-report-period">
                {formatDateRange()}
              </strong>

              <p>{t("report.workPeriodDescription")}</p>
            </article>

            <article className="ai-report-stat-card">
              <span>
                {t("report.averageDifficulty")}
              </span>

              <strong>
                {Number(
                  report.statistics
                    ?.averageDifficulty || 0
                ).toFixed(1)}
              </strong>

              <p>
                {t("report.averageDifficultyDescription")}
              </p>
            </article>

            <article className="ai-report-stat-card">
              <span>{t("report.technologyCount")}</span>

              <strong>{tagCounts.length}</strong>

              <p>
                {t("report.technologyCountDescription")}
              </p>
            </article>
          </section>

          <section className="ai-report-content-grid">
            <article className="ai-report-panel ai-report-summary-panel">
              <header className="ai-report-panel-header">
                <span className="ai-report-section-number">
                  01
                </span>

                <div>
                  <h2>{t("report.workSummary")}</h2>

                  <p>
                    {t(
                      "report.workSummaryDescription"
                    )}
                  </p>
                </div>
              </header>

              <p className="ai-report-body-text">
                {report.workSummary ||
                  t("common.noData")}
              </p>
            </article>

            <article className="ai-report-panel">
              <header className="ai-report-panel-header">
                <span className="ai-report-section-number">
                  02
                </span>

                <div>
                  <h2>{t("report.statistics")}</h2>

                  <p>
                    {t("report.statisticsDescription")}
                  </p>
                </div>
              </header>

              <div className="ai-report-statistics-layout">
                <div>
                  <h3>{t("report.difficultyCounts")}</h3>

                  <div className="ai-report-difficulty-list">
                    {difficultyCounts.map((item) => (
                      <div
                        className="ai-report-difficulty-item"
                        key={item.difficulty}
                      >
                        <span>{item.difficulty}</span>

                        <strong>{item.count}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3>{t("report.technologyTags")}</h3>

                  {tagCounts.length > 0 ? (
                    <div className="ai-report-tag-list">
                      {tagCounts.map(
                        (item, index) => (
                          <span
                            className={`ai-report-tag ai-report-tag-${
                              TAG_COLORS[
                                index %
                                  TAG_COLORS.length
                              ]
                            }`}
                            key={item.tag}
                          >
                            {item.tag}
                            <strong>{item.count}</strong>
                          </span>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="ai-report-empty-text">
                      {t("common.noData")}
                    </p>
                  )}
                </div>
              </div>
            </article>
          </section>

          <section className="ai-report-panel">
            <header className="ai-report-panel-header">
              <span className="ai-report-section-number">
                03
              </span>

              <div>
                <h2>{t("report.implementedFeatures")}</h2>

                <p>
                  {t(
                    "report.implementedFeaturesDescription"
                  )}
                </p>
              </div>
            </header>

            {Array.isArray(
              report.implementedFeatures
            ) &&
            report.implementedFeatures.length > 0 ? (
              <div className="ai-report-feature-list">
                {report.implementedFeatures.map(
                  (featureGroup, groupIndex) => (
                    <article
                      className="ai-report-feature-card"
                      key={`${featureGroup.category}-${groupIndex}`}
                    >
                      <div className="ai-report-feature-heading">
                        <span>
                          {String(groupIndex + 1).padStart(
                            2,
                            "0"
                          )}
                        </span>

                        <h3>
                          {featureGroup.category ||
                            t(
                              "report.uncategorizedFeature"
                            )}
                        </h3>
                      </div>

                      {Array.isArray(
                        featureGroup.features
                      ) &&
                        featureGroup.features.length >
                          0 && (
                          <ul>
                            {featureGroup.features.map(
                              (
                                feature,
                                featureIndex
                              ) => (
                                <li
                                  key={`${feature}-${featureIndex}`}
                                >
                                  {feature}
                                </li>
                              )
                            )}
                          </ul>
                        )}

                      {featureGroup.description && (
                        <p>
                          {featureGroup.description}
                        </p>
                      )}
                    </article>
                  )
                )}
              </div>
            ) : (
              <div className="ai-report-section-empty">
                {t("common.noData")}
              </div>
            )}
          </section>

          <section className="ai-report-analysis-grid">
            <article className="ai-report-panel">
              <header className="ai-report-panel-header">
                <span className="ai-report-section-number">
                  04
                </span>

                <div>
                  <h2>
                    {t("report.difficultyAnalysis")}
                  </h2>

                  <p>
                    {t(
                      "report.difficultyAnalysisDescription"
                    )}
                  </p>
                </div>
              </header>

              <p className="ai-report-body-text">
                {report.difficultyAnalysis ||
                  t("common.noData")}
              </p>
            </article>

            <article className="ai-report-panel">
              <header className="ai-report-panel-header">
                <span className="ai-report-section-number">
                  05
                </span>

                <div>
                  <h2>
                    {t("report.projectAchievements")}
                  </h2>

                  <p>
                    {t(
                      "report.projectAchievementsDescription"
                    )}
                  </p>
                </div>
              </header>

              <p className="ai-report-body-text">
                {report.projectAchievements ||
                  t("common.noData")}
              </p>
            </article>
          </section>

          <section className="ai-report-panel ai-report-improvement-panel">
            <header className="ai-report-panel-header">
              <span className="ai-report-section-number">
                06
              </span>

              <div>
                <h2>{t("report.futureImprovements")}</h2>

                <p>
                  {t(
                    "report.futureImprovementsDescription"
                  )}
                </p>
              </div>
            </header>

            {Array.isArray(
              report.futureImprovements
            ) &&
            report.futureImprovements.length > 0 ? (
              <ol className="ai-report-improvement-list">
                {report.futureImprovements.map(
                  (improvement, index) => (
                    <li
                      key={`${improvement}-${index}`}
                    >
                      <span>{index + 1}</span>

                      <p>{improvement}</p>
                    </li>
                  )
                )}
              </ol>
            ) : (
              <div className="ai-report-section-empty">
                {t("common.noData")}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}

export default AiReportPage;