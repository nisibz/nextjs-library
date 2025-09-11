export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publicationYear: number;
  quantity: number;
  coverImage: string | null;
  createdAt: string;
  updatedAt: string;
  activeTransactions: [
    {
      id: number;
      bookId: number;
      userId: number;
      borrowDate: string;
      returnDate: null;
      createdAt: string;
      updatedAt: string;
      user: {
        id: number;
        username: string;
      };
    },
  ];
}

export type BookListItem = Omit<Book, "activeTransactions">;

export interface BooksResponse {
  data: BookListItem[];
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
