import { useState } from "react";
import removeMd from "remove-markdown";

export default function TestCleanQuote() {
  const [text, setText] = useState<string>("");
  const [cleanedText, setCleanedText] = useState<string>("");

  function cleanQuote(input: string): string {
    const trimmed = input.trim();

    // Удаляем блок кода, если есть
    const codeBlockMatch = trimmed.match(/```(?:\w+)?\n([\s\S]*?)```/);
    const extracted = codeBlockMatch ? codeBlockMatch[1] : trimmed;

    // Удаляем markdown
    let clean = removeMd(extracted);

    // Удаляем обрамляющие кавычки и точки
    clean = clean
      .trim()
      .replace(/^["'“”«»\s]+/, "")
      .replace(/["'“”»«\s]+[.,!?…]*$/, "");

    return clean.trim();
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        marginTop: "1rem",
      }}
    >
      <h2>Тест очистки цитаты</h2>
      <p>{cleanedText}</p>
      <textarea
        name="theme"
        id="theme"
        maxLength={500}
        value={text}
        placeholder="Цитата"
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={() => setCleanedText(cleanQuote(text))}>Очистить</button>
    </div>
  );
}
