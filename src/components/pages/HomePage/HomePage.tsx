import React from "react";
import { useState } from "react";
import "./HomePage.css";
import GeneratorForm from "../../GeneratorForm/GeneratorForm";
import QuoteCard from "../../QuoteCard/QuoteCard";
import { authorAssets, maskAssets } from "../../../assetsMap";

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
];

export default function HomePage() {
  const [currentAuthor, setCurrentAuthor] = React.useState<Author>(authors[0]);
  const [theme, setTheme] = useState("");
  const [generatedQuote, setGeneratedQuote] = useState<string>('');
  const [generatedAuthor, setGeneratedAuthor] = useState<Author | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      setGeneratedAuthor(currentAuthor); // фиксация выбранного автора
      // Здесь будет логика генерации цитаты на основе выбранного автора и темы
      // Будет использован API нейросети для генерации цитат
      // Для примера пока установлена статичная цитата
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Заглушка

      setGeneratedQuote(
        `"Сложно быть человеком, гораздо проще быть пришельцем. Или рыбой-пришельцем. Ведь рыба-пришелец — это не просто рыба, а рыба с характером"`
      );
    } catch (error) {
      console.error("Ошибка при генерации:", error);
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
        Выбери персонажа, задай тему — получи цитату,
        <span className="highlight"> которая взорвёт мозг </span>
        твоим друзьям
      </p>
    </div>
  );

  return (
    <div className="home-page_wrapper">
      <div className="content_wrapper">
        { generatedAuthor ? (
          <QuoteCard author={generatedAuthor} quote={generatedQuote} isGenerating={isGenerating}/>
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
      </div>
    </div>
  );
}
