import "./QuoteCard.css";
import { useEffect, useRef, useState } from "react";
import { Author } from "../pages/HomePage/HomePage";
import { toPng } from "html-to-image";
import Loader from "../Loader/Loader";

interface QuoteCardProps {
  author: Author;
  quote: string;
  isGenerating: boolean;
}

export default function QuoteCard({
  author,
  quote,
  isGenerating,
}: QuoteCardProps) {
  const cardRef = useRef(null);
  const [fontSize, setFontSize] = useState(0);
  const [paddingSize, setPaddingSize] = useState(0);
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      setFontSize(width * 0.06);
      setPaddingSize(width * 0.08);
    });

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // при смене автора — сбрасываем фон
    setBgIndex(0);
  }, [author]);

  const handleDownload = async () => {
    if (!cardRef.current) return;

    try {
      const dataUrl = await toPng(cardRef.current as HTMLElement);
      const link = document.createElement("a");
      link.download = "quote.png";
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Ошибка при сохранении изображения:", error);
    }
  };

  return (
    <div className="quote-card-wrapper">
      <div className={`quote-card-container ${
          isGenerating ? "generating" : ""
        }`}>
        <div className="quote-card" style={author.fontStyle} ref={cardRef}>
          {isGenerating ? (
            <Loader />
          ) : (
            <>
              {" "}
              <img src={author.backgrounds[bgIndex]} alt={author.name} />
              <div
                className="quote-container"
                style={{ padding: `0 ${paddingSize}px` }}
              >
                <div
                  className="quote-text"
                  style={{
                    fontSize: `${fontSize}px`,
                  }}
                >
                  {quote}
                </div>
                <div
                  className="quote-author"
                  style={{ fontSize: `${fontSize * 0.7}px` }}
                >
                  — {author.name}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div
        className={`quote-card-buttons-wrapper ${
          isGenerating ? "generating" : ""
        }`}
      >
        <div className="switch-bg-buttons-wrapper">
          <button
            className="switch-bg-left quote-card-button"
            onClick={() =>
              setBgIndex(
                (prev) =>
                  (prev - 1 + author.backgrounds.length) %
                  author.backgrounds.length
              )
            }
          />
          <button
            className="switch-bg-right quote-card-button"
            onClick={() =>
              setBgIndex((prev) => (prev + 1) % author.backgrounds.length)
            }
          />
        </div>
        <button
          className="download-button quote-card-button"
          onClick={handleDownload}
        />
      </div>
    </div>
  );
}
