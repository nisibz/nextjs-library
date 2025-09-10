export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publicationYear: number;
  coverImage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BooksResponse {
  data: Book[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CreateBookData {
  title: string;
  author: string;
  isbn: string;
  publicationYear: number;
  coverImage?: File;
}

export type UpdateBookData = Partial<CreateBookData>;
