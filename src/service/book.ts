import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Book, BooksResponse, CreateBookData, UpdateBookData } from "../types/book";

export const booksApi = createApi({
  reducerPath: "booksApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3100/",
  }),
  refetchOnFocus: true,
  tagTypes: ["Book"],
  endpoints: (builder) => ({
    getBooks: builder.query<BooksResponse, { page?: number; limit?: number; search?: string }>({
      query: ({ page = 1, limit = 10, search } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (search) {
          params.append('search', search);
        }
        return `books?${params.toString()}`;
      },
      providesTags: ["Book"],
    }),
    getBook: builder.query<Book, number>({
      query: (id) => `books/${id}`,
      providesTags: (result, error, id) => [{ type: "Book", id }],
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
        if (data.publicationYear) formData.append("publicationYear", data.publicationYear.toString());
        if (data.coverImage) formData.append("coverImage", data.coverImage);
        return {
          url: `books/${id}`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: (result, error, { id }) => [{ type: "Book", id }, "Book"],
    }),
    deleteBook: builder.mutation<Book, number>({
      query: (id) => ({
        url: `books/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Book"],
    }),
  }),
});

export const {
  useGetBooksQuery,
  useGetBookQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
} = booksApi;
