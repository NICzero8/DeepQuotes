const images = import.meta.glob("@assets/images/authors/*/*.png", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const masks = import.meta.glob("@assets/images/authors/*/avatar.svg", {
  eager: true,
  import: "default",
}) as Record<string, string>;

export const maskAssets: Record<string, string> = {};
export const authorAssets: Record<string, string[]> = {};

// Заполняем authorAssets
Object.entries(images).forEach(([path, url]) => {
  const match = path.match(/authors\/([^/]+)\/([^/]+\.png)$/);
  if (!match) return;

  const [, authorId] = match;

  if (!authorAssets[authorId]) {
    authorAssets[authorId] = [];
  }

  authorAssets[authorId].push(url);
});

// Преобразуем путь в authorId и сохраняем
Object.entries(masks).forEach(([path, url]) => {
  const match = path.match(/authors\/([^/]+)\/avatar\.svg$/);
  if (!match) return;

  const authorId = match[1];
  maskAssets[authorId] = url;
});

// Опционально сортируем фоны по имени файла
for (const key in authorAssets) {
  authorAssets[key].sort();
}
