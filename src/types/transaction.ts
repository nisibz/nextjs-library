import type { User } from "./auth";

export interface BookTransaction {
  id: number;
  bookId: number;
  userId: number;
  borrowDate: string;
  returnDate: string | null;
  createdAt: string;
  updatedAt: string;
  book: {
    id: number;
    title: string;
    author: string;
    isbn: string;
    publicationYear: number;
    quantity: number;
    coverImage: string | null;
    createdAt: string;
    updatedAt: string;
  };
  user: User;
}

export type BorrowResponse = BookTransaction;
