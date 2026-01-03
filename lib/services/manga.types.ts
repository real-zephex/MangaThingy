export interface Manga {
  id: string;
  title: string;
  image: string;
  description?: string;
  author?: string;
  status?: string;
  genres?: string[];
  year?: string;
  type?: string;
}

export interface Chapter {
  id: string;
  title: string;
  date?: string;
}

export interface MangaInfo extends Manga {
  chapters: Chapter[];
}


export interface Results<T> {
  status: number;
  results: T[];
}

export interface MangaInfoResults<T> {
  status: number;
  results: T;
}