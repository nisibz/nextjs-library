import { createApi } from "@reduxjs/toolkit/query/react";
import type { BookTransaction } from "../types/transaction";
import { baseQueryWithAuth } from "../lib/baseQuery";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithAuth,
  refetchOnFocus: true,
  tagTypes: ["UserBooks"],
  endpoints: (builder) => ({
    getBorrowedBooks: builder.query<BookTransaction[], void>({
      query: () => "user/borrowed-books",
      providesTags: ["UserBooks"],
    }),
  }),
});

export const { useGetBorrowedBooksQuery } = userApi;
