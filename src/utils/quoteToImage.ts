import { Author } from "../components/pages/HomePage/HomePage";

export async function quoteToImage({
  // name,
  choosedBg,
  authorFont,
  quote,
  width = 1024,
  height = 1024,
}: {
  name: Author["name"];
  choosedBg: string;
  authorFont: Author["font"];
  quote: string;
  width?: number;
  height?: number;
}): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context not available");

  // Загрузка фонового изображения
  const bgSrc = choosedBg; // или случайный из массива
  const bg = await loadImage(bgSrc);
  ctx.drawImage(bg, 0, 0, width, height);

  // Настройка шрифта и текста
  const font = authorFont || "48px sans-serif";
  ctx.font = font;
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  wrapText(ctx, quote, width / 2, height / 2, width * 0.86, 90);

  return new Promise((resolve) =>
    canvas.toBlob((blob) => {
      if (!blob) throw new Error("Failed to create blob from canvas");
      resolve(blob);
    }, "image/png")
  );
}

// function extractFontFamily(fontFamily: string): string {
//   const match = fontFamily.match(/"([^"]+)"|([^,]+)/);
//   return match ? match[1] || match[2] : "sans-serif";
// }

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // если изображения подгружаются через URL
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(" ");
  let line = "";
  const lines: string[] = [];
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && i > 0) {
      lines.push(line);
      line = words[i] + " ";
    } else {
      line = testLine;
    }
  }
  lines.push(line);

  const startY = y - (lines.length / 2) * lineHeight;
  lines.forEach((l, i) => {
    ctx.fillText(l.trim(), x, startY + i * lineHeight);
  });
}