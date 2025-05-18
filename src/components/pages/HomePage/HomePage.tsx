import React from "react";
import { useState } from "react";
import "./HomePage.css";
import GeneratorForm from "../../GeneratorForm/GeneratorForm";
import QuoteCard from "../../QuoteCard/QuoteCard";
import { authorAssets, maskAssets } from "../../../assetsMap";
// import TestCleanQuote from "../../TestCleanQuote";

export type Author = {
  id: string;
  name: string;
  fontStyle: React.CSSProperties;
  font?: string;
  backgrounds: string[];
  mask: string;
};

const authors: Author[] = [
  {
    id: "einstein",
    name: "Альберт Эйнштейн",
    fontStyle: { fontFamily: '"Prata", sans-serif', fontWeight: 600 },
    backgrounds: authorAssets["einstein"],
    mask: maskAssets["einstein"],
  },
  {
    id: "confucius",
    name: "Конфуций",
    fontStyle: { fontFamily: '"Cormorant Unicase", serif', fontWeight: 700 },
    backgrounds: authorAssets["confucius"],
    mask: maskAssets["confucius"],
  },
  {
    id: "statham",
    name: "Джейсон Стэтхэм",
    fontStyle: { fontFamily: '"Russo One", sans-serif', fontWeight: 400 },
    backgrounds: authorAssets["statham"],
    mask: maskAssets["statham"],
  },
  {
    id: "stallone",
    name: "Сильвестр Сталлоне",
    fontStyle: { fontFamily: '"Oswald", sans-serif', fontWeight: 400 },
    backgrounds: authorAssets["stallone"],
    mask: maskAssets["stallone"],
  },
    {
    id: "diesel",
    name: "Вин Дизель",
    fontStyle: { fontFamily: '"Exo 2", sans-serif', fontWeight: 700 },
    backgrounds: authorAssets["diesel"],
    mask: maskAssets["diesel"],
  },
];

export default function HomePage() {
  const [currentAuthor, setCurrentAuthor] = React.useState<Author>(authors[0]);
  const [theme, setTheme] = useState("");
  const [generatedQuote, setGeneratedQuote] = useState<string>("");
  const [generatedAuthor, setGeneratedAuthor] = useState<Author | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isError, setIsError] = useState<boolean>(false);

const handleGenerate = async () => {
  setIsGenerating(true);
  try {
    setGeneratedAuthor(currentAuthor);

    const res = await fetch("/api/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        author: currentAuthor.name,
        theme: theme,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setGeneratedQuote(data.quote);
      setIsError(false);
    } else {
      console.error("Ошибка от сервера:", data.error);
      setIsError(true);
    }
  } catch (error) {
    console.error("Ошибка при генерации:", error);
    setIsError(true);
  } finally {
    setIsGenerating(false);
  }
};

  const welcomeMessage = (
    // Сообщение, выводимое при первоначальной загрузке в content-wrapper
    // После генерации цитаты оно будет заменено на компонент QuoteCard
    <div className="welcome-message">
      <h2 className="gradient-text-accent">Создай мудрость в стиле великих!</h2>
      <p className="description">
        Выбери личность, задай тему — получи цитату, которая
        <span className="gradient-text-accent"> взорвёт мозг </span>
        твоим друзьям
      </p>
    </div>
  );

  return (
    <div className="home-page_wrapper">
      <div className="content_wrapper">
        {generatedAuthor ? (
          <QuoteCard
            author={generatedAuthor}
            quote={generatedQuote}
            isGenerating={isGenerating}
            isError={isError}
          />
        ) : (
          welcomeMessage
        )}
      </div>
      <div className="settings_wrapper">
        <GeneratorForm
          authors={authors}
          currentAuthor={currentAuthor}
          setCurrentAuthor={setCurrentAuthor}
          theme={theme}
          setTheme={setTheme}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />
        {/* <TestCleanQuote /> */}
      </div>
    </div>
  );
}
