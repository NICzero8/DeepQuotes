import React from "react";
import "./GeneratorForm.css";
import AuthorSelector from "../AuthorSelector/AuthorSelector";
import { Author } from "../pages/HomePage/HomePage";

interface GeneratorFormProps {
  authors: Author[];
  currentAuthor: { id: string; name: string };
  theme: string;
  setCurrentAuthor: (author: Author) => void;
  setTheme: (theme: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export default function GeneratorForm({
  authors,
  currentAuthor,
  setCurrentAuthor,
  theme,
  setTheme,
  onGenerate,
  isGenerating,
}: GeneratorFormProps) {
  const authorListHTML: React.ReactNode = authors.map((author) => (
    <div key={author.id}>
      <input
        name="author"
        type="radio"
        id={author.id}
        checked={currentAuthor.id === author.id}
        onChange={() => setCurrentAuthor(author)}
      />
      <label className="avatar" htmlFor={author.id}>
        <span
          style={{
            mask: `url(${author.mask}) no-repeat center`,
            WebkitMask: `url(${author.mask}) no-repeat center`,
          }}
        />
      </label>
    </div>
  ));

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onGenerate();
        }}
      >
        <label htmlFor="name" className="author-label">
          Автор: {currentAuthor.name}
        </label>
        <AuthorSelector>{authorListHTML}</AuthorSelector>
        <label className="theme-label" htmlFor="theme">
          Тема: 
        </label>
        <textarea
          name="theme"
          id="theme"
          maxLength={100}
          value={theme}
          placeholder="О квантовых кошках..."
          onChange={(e) => setTheme(e.target.value)}
        />
        <input
          type="submit"
          value={isGenerating ? "Идет создание..." : "Создать"}
          disabled={isGenerating}
        />
      </form>
    </>
  );
}
