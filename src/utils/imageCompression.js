const SUPPORTED_TYPES = new Set([
  "image/jpeg",
  "image/png",
]);

const MAX_SOURCE_BYTES = 20 * 1024 * 1024;
const TARGET_UPLOAD_BYTES = 3.8 * 1024 * 1024;
const MAX_DIMENSION = 2200;

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("IMAGE_DECODE_FAILED"));
    };

    image.src = url;
  });
}

function canvasToBlob(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("IMAGE_COMPRESS_FAILED"));
          return;
        }
        resolve(blob);
      },
      "image/jpeg",
      quality
    );
  });
}

export async function prepareMemoImage(file) {
  if (!file) {
    throw new Error("NO_FILE");
  }

  if (!SUPPORTED_TYPES.has(file.type)) {
    throw new Error("UNSUPPORTED_TYPE");
  }

  if (file.size > MAX_SOURCE_BYTES) {
    throw new Error("SOURCE_TOO_LARGE");
  }

  const image = await loadImage(file);
  const scale = Math.min(
    1,
    MAX_DIMENSION / image.naturalWidth,
    MAX_DIMENSION / image.naturalHeight
  );

  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));

  if (
    file.size <= TARGET_UPLOAD_BYTES &&
    scale === 1 &&
    file.type === "image/jpeg"
  ) {
    return file;
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("IMAGE_COMPRESS_FAILED");
  }

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);

  const qualities = [0.86, 0.78, 0.7, 0.62];
  let blob = null;

  for (const quality of qualities) {
    blob = await canvasToBlob(canvas, quality);
    if (blob.size <= TARGET_UPLOAD_BYTES) {
      break;
    }
  }

  if (!blob || blob.size > TARGET_UPLOAD_BYTES) {
    throw new Error("COMPRESSED_TOO_LARGE");
  }

  const baseName = file.name.replace(/\.[^.]+$/, "") || "memo";
  return new File(
    [blob],
    `${baseName}.jpg`,
    {
      type: "image/jpeg",
      lastModified: Date.now(),
    }
  );
}
