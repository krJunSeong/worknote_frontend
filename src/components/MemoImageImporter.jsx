import { useEffect, useRef, useState } from "react";
import { createDraftFromMemoImage } from "../api/memoImageApi";
import { useLanguage } from "../i18n/LanguageContext";
import { prepareMemoImage } from "../utils/imageCompression";
import "./MemoImageImporter.css";

function MemoImageImporter({
  disabled = false,
  hasExistingContent = false,
  onApply,
}) {
  const inputRef = useRef(null);
  const { language, t } = useLanguage();

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [draft, setDraft] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl("");
      return undefined;
    }

    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  const resetResult = () => {
    setDraft(null);
    setErrorMessage("");
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    resetResult();
  };

  const openFilePicker = () => {
    if (!inputRef.current) return;
    inputRef.current.value = "";
    inputRef.current.click();
  };

  const getReadableError = (error) => {
    switch (error.message) {
      case "UNSUPPORTED_TYPE":
        return t("memoImage.unsupportedFile");
      case "SOURCE_TOO_LARGE":
      case "COMPRESSED_TOO_LARGE":
        return t("memoImage.fileTooLarge");
      case "IMAGE_DECODE_FAILED":
      case "IMAGE_COMPRESS_FAILED":
        return t("memoImage.imageReadError");
      default:
        break;
    }

    const status = error.response?.status;
    if (status === 400) {
      return t("memoImage.invalidImage");
    }
    if (status === 503) {
      return t("memoImage.serviceUnavailable");
    }

    return t("memoImage.analysisError");
  };

  const analyzeImage = async () => {
    if (!selectedFile || analyzing || disabled) return;

    try {
      setAnalyzing(true);
      setErrorMessage("");
      setDraft(null);

      const preparedFile = await prepareMemoImage(selectedFile);
      const response = await createDraftFromMemoImage(
        preparedFile,
        language
      );

      setDraft(response);
    } catch (error) {
      console.error("메모 이미지 분석 실패:", error);
      setErrorMessage(getReadableError(error));
    } finally {
      setAnalyzing(false);
    }
  };

  const applyDraft = (mode) => {
    if (!draft || !onApply) return;
    onApply(draft, mode);
  };

  return (
    <section className="memo-importer">
      <div className="memo-importer-head">
        <div>
          <span className="memo-importer-kicker">
            {t("memoImage.kicker")}
          </span>
          <h3>{t("memoImage.title")}</h3>
          <p>{t("memoImage.description")}</p>
        </div>
        <span className="memo-importer-badge">OCR + AI</span>
      </div>

      <input
        ref={inputRef}
        className="memo-importer-file-input"
        type="file"
        accept="image/jpeg,image/png,.jpg,.jpeg,.png"
        onChange={handleFileChange}
        disabled={disabled || analyzing}
      />

      {!selectedFile ? (
        <button
          type="button"
          className="memo-importer-dropzone"
          onClick={openFilePicker}
          disabled={disabled}
        >
          <span className="memo-importer-camera" aria-hidden="true">
            ◉
          </span>
          <strong>{t("memoImage.selectImage")}</strong>
          <small>{t("memoImage.fileGuide")}</small>
        </button>
      ) : (
        <div className="memo-importer-selected">
          <div className="memo-importer-image-wrap">
            {previewUrl && (
              <img
                src={previewUrl}
                alt={t("memoImage.previewAlt")}
                className="memo-importer-image"
              />
            )}
          </div>

          <div className="memo-importer-file-info">
            <strong>{selectedFile.name}</strong>
            <span>
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </span>
            <button
              type="button"
              onClick={openFilePicker}
              disabled={disabled || analyzing}
            >
              {t("memoImage.changeImage")}
            </button>
          </div>
        </div>
      )}

      {selectedFile && !draft && (
        <button
          type="button"
          className="memo-importer-analyze"
          onClick={analyzeImage}
          disabled={disabled || analyzing}
        >
          {analyzing && (
            <span className="memo-importer-spinner" aria-hidden="true" />
          )}
          {analyzing
            ? t("memoImage.analyzing")
            : t("memoImage.analyzeButton")}
        </button>
      )}

      {analyzing && (
        <p className="memo-importer-processing-note">
          {t("memoImage.processingNote")}
        </p>
      )}

      {errorMessage && (
        <div className="memo-importer-error" role="alert">
          {errorMessage}
        </div>
      )}

      {draft && (
        <div className="memo-importer-result">
          <div className="memo-importer-result-head">
            <div>
              <span>{t("memoImage.resultKicker")}</span>
              <h4>{t("memoImage.resultTitle")}</h4>
            </div>
            <button
              type="button"
              onClick={analyzeImage}
              disabled={disabled || analyzing}
            >
              {t("memoImage.retry")}
            </button>
          </div>

          <dl className="memo-importer-draft">
            <div>
              <dt>{t("workLog.titleLabel")}</dt>
              <dd>{draft.title}</dd>
            </div>
            <div>
              <dt>{t("workLog.contentLabel")}</dt>
              <dd>{draft.content}</dd>
            </div>
          </dl>

          {draft.recognizedText && (
            <details className="memo-importer-raw">
              <summary>{t("memoImage.showRawText")}</summary>
              <pre>{draft.recognizedText}</pre>
            </details>
          )}

          <p className="memo-importer-privacy">
            {t("memoImage.reviewNotice")}
          </p>

          <div className="memo-importer-actions">
            {hasExistingContent && (
              <button
                type="button"
                className="memo-importer-append"
                onClick={() => applyDraft("append")}
                disabled={disabled}
              >
                {t("memoImage.append")}
              </button>
            )}
            <button
              type="button"
              className="memo-importer-apply"
              onClick={() => applyDraft("replace")}
              disabled={disabled}
            >
              {hasExistingContent
                ? t("memoImage.replace")
                : t("memoImage.apply")}
            </button>
          </div>
        </div>
      )}

      <p className="memo-importer-provider-note">
        {t("memoImage.providerNotice")}
      </p>
    </section>
  );
}

export default MemoImageImporter;
