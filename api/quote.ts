import type { VercelRequest, VercelResponse } from "@vercel/node";
import removeMd from "remove-markdown";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { author, theme } = req.body;

  if (!author) {
    return res.status(400).json({ error: "Author is required" });
  }

  const prompt = generatePrompt(author, theme);
  // console.log("Сгенерированный промпт:", prompt);

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-prover-v2:free",
          messages: [
            {
              role: "system",
              content:
                "Ты придумываешь ТОЛЬКО ОДНУ фразу в стиле указанного автора. Никаких пояснений, кода, кавычек, имён. Только текст цитаты. Не более 25 слов. Если тема сложная — интерпретируй её абсурдно.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.9,
          stop: ["```", "def ", "print(", "**", "* ", "# ", "1. ", "- "], // Блокируем код и Markdown
          response_format: { type: "text" }, // Форсируем plain text (если API поддерживает)
        }),
      }
    );

    const text = await response.text();

    // Пытаемся распарсить текст как JSON
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      console.error("== Ответ не JSON ==\n", text);
      return res.status(500).json({ error: "Ошибка разбора ответа от модели" });
    }

    if (!response.ok) {
      console.error("== Ответ с ошибкой ==\n", json);
      return res
        .status(500)
        .json({ error: json.error?.message || "Ошибка от языковой модели" });
    }

    const rawQuote = json.choices?.[0]?.message?.content?.trim();
    const quote = rawQuote ? cleanQuote(rawQuote) : null;
    // console.log("== Очищенная цитата ==\n", quote);
    // console.log("== Сгенерированная цитата ==\n", rawQuote);
    if (!quote) {
      return res.status(500).json({ error: "Модель не вернула цитату" });
    }

    return res.status(200).json({ quote });
  } catch (err: any) {
    console.error("== Неожиданная ошибка сервера ==\n", err);
    return res
      .status(500)
      .json({ error: "Внутренняя ошибка сервера при генерации цитаты" });
  }
}

function generatePrompt(author: string, theme: string): string {
  if (author.toLowerCase().includes("стэтхэм")) {
    return `Придумай цитату в стиле Джейсона Стейтема — короткую, брутальную, с чёрным юмором или абсурдной логикой. Не более 20 слов. Используй его образ из мемов популярных в российском интернете: крутой, немного агрессивный, туповатый, с намёком на экшен-фильмы. Тема: ${theme}. Тон: саркастичный, брутальный. Избегай сложных метафор. Можешь сделать цитату более резкой, добавить ненормативной лексики (если уместно) или угрозы. Примеры для вдохновения:
«Школа — не сцепление, можно и кинуть»,
«одна ошибка и ты ошибся»,
«однажды мне стало лень обходить гору, так что я прошел её насквозь, теперь это называют туннелем»,
«детство - это когда все в колготках, но не педики.»,
«у меня с собой две пушки, одна огнестрел, другая для подружки.»`;
  }

  if (author.toLowerCase().includes("дизель")) {
    return `Придумай цитату в стиле Вина Дизеля — пафосную, с туповатой "мудростью" и одержимостью семьёй, гоночными тачками и братством. Должно звучать как речь Доминика Торетто из "Форсажа", но с абсурдным уклоном. Не более 25 слов. Тема: ${theme}. Можешь использовать слова: "семья", "кредо", "двигатель", "гоночный", "кровь", "улицы", или подобные. Сарказм и наигранная серьёзность приветствуются. Примеры стиля:
«И запомни — гонщики не гонят. Гонщики гоняют, да не загоняются»,
«Семья — это не те, кто родился с тобой в одном городе. Это те, за кого ты готов переехать чужой город»,
«Жизнь — как 10-литровый движок: если не трясёт — значит, ты уже на кладбище»,
«Любовь — это когда ты меняешь свечи в её тачке в 3 часа ночи»,
«Если в твоей жизни нет нитроускорителя — значит, ты живёшь неправильно»`;
  }

  if (author.toLowerCase().includes("сталлоне")) {
    return `Придумай пафосную, простую и мотивационную фальшивую цитату Сталлоне, в стиле персонажей Сильвестра Сталлоне. Например, как его речь к сыну в фильме Рокки. Тема: ${theme}.`;
  }

  return `Придумай мудрую фальшивую цитату в стиле ${author}. Тема: ${theme}.`;
}

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
