const mockQuotes = {
    einstein: [
      "Если вы не можете объяснить это коту, вы сами этого не понимаете.",
      "React — это квантовая запутанность в мире фронтенда."
    ],
    stallone: [
      "Код — это как бокс: если ты не повалил баг с первого удара, беги.",
    ]
  };
  
  export const generateQuote = (author: string) => {
    return mockQuotes.einstein[0];
  };