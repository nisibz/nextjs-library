import { createApi } from "@reduxjs/toolkit/query/react";
import type {
  Book,
  BooksResponse,
  CreateBookData,
  UpdateBookData,
} from "../types/book";
import type { BookTransaction } from "../types/transaction";
import { baseQueryWithAuth } from "../lib/baseQuery";

export const booksApi = createApi({
  reducerPath: "booksApi",
  baseQuery: baseQueryWithAuth,
  refetchOnFocus: true,
  tagTypes: ["Book", "Transaction"],
  endpoints: (builder) => ({
    getBooks: builder.query<
      BooksResponse,
      { page?: number; limit?: number; search?: string }
    >({
      query: ({ page = 1, limit = 10, search } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (search) {
          params.append("search", search);
        }
        return `books?${params.toString()}`;
      },
      providesTags: ["Book"],
    }),
    getBook: builder.query<Book, number>({
      query: (id) => `books/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Book", id }],
    }),
    createBook: builder.mutation<Book, CreateBookData>({
      query: (newBook) => {
        const formData = new FormData();
        formData.append("title", newBook.title);
        formData.append("author", newBook.author);
        formData.append("isbn", newBook.isbn);
        formData.append("publicationYear", newBook.publicationYear.toString());
        if (newBook.coverImage) {
          formData.append("coverImage", newBook.coverImage);
        }
        return {
          url: "books",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Book"],
    }),
    updateBook: builder.mutation<Book, { id: number; data: UpdateBookData }>({
      query: ({ id, data }) => {
        const formData = new FormData();
        if (data.title) formData.append("title", data.title);
        if (data.author) formData.append("author", data.author);
        if (data.isbn) formData.append("isbn", data.isbn);
        if (data.publicationYear)
          formData.append("publicationYear", data.publicationYear.toString());
        if (data.coverImage) formData.append("coverImage", data.coverImage);
        return {
          url: `books/${id}`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Book", id },
        "Book",
      ],
    }),
    deleteBook: builder.mutation<Book, number>({
      query: (id) => ({
        url: `books/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Book"],
    }),
    borrowBook: builder.mutation<BookTransaction, number>({
      query: (bookId) => ({
        url: `books/${bookId}/borrow`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, bookId) => [
        { type: "Book", id: bookId },
        "Book",
        "Transaction",
      ],
    }),
    returnBook: builder.mutation<BookTransaction, number>({
      query: (bookId) => ({
        url: `books/${bookId}/return`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, bookId) => [
        { type: "Book", id: bookId },
        "Book",
        "Transaction",
      ],
    }),
    getBookTransactions: builder.query<BookTransaction[], number>({
      query: (bookId) => `books/${bookId}/transactions`,
      providesTags: (_result, _error, bookId) => [
        { type: "Transaction", id: bookId },
      ],
    }),
  }),
});

export const {
  useGetBooksQuery,
  useGetBookQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useBorrowBookMutation,
  useReturnBookMutation,
  useGetBookTransactionsQuery,
} = booksApi;
