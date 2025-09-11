"use client";

import { useGetBorrowedBooksQuery } from "@/service/user";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useReturnBookMutation } from "@/service/book";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { CalendarDays, Book } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function MyBooksPage() {
  const {
    data: borrowedBooks,
    isLoading,
    error,
    refetch,
  } = useGetBorrowedBooksQuery(undefined, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
  const [returnBook, { isLoading: isReturning }] = useReturnBookMutation();

  const handleReturnBook = async (bookId: number) => {
    try {
      await returnBook(bookId).unwrap();
      refetch(); // Refresh the borrowed books list
    } catch (error) {
      console.error("Failed to return book:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-2 mb-6">
          <Book className="h-6 w-6" />
          <h1 className="text-2xl font-bold">My Borrowed Books</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <Skeleton className="h-40 w-full mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-2 mb-6">
          <Book className="h-6 w-6" />
          <h1 className="text-2xl font-bold">My Borrowed Books</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-red-600">
              Failed to load borrowed books. Please try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <Book className="h-6 w-6" />
        <h1 className="text-2xl font-bold">My Borrowed Books</h1>
        <Badge variant="secondary">{borrowedBooks?.length || 0} books</Badge>
      </div>

      {!borrowedBooks || borrowedBooks.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Book className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No borrowed books</h3>
            <p className="text-gray-600 dark:text-gray-400">
              You haven&apos;t borrowed any books yet. Browse the library to
              find books to borrow.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {borrowedBooks.map((transaction) => (
            <Card key={transaction.id}>
              <CardContent className="p-6">
                <div className="flex gap-4 mb-4">
                  <div className="w-20 h-28 bg-gray-200 rounded flex items-center justify-center relative overflow-hidden flex-shrink-0">
                    {transaction.book.coverImage ? (
                      <Image
                        src={transaction.book.coverImage}
                        alt={transaction.book.title}
                        fill
                        className="object-cover rounded"
                        sizes="80px"
                      />
                    ) : (
                      <span className="text-xs text-gray-500">No Image</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1 truncate">
                      {transaction.book.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      by {transaction.book.author}
                    </p>
                    <div className="space-y-1 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        <span>
                          Borrowed:{" "}
                          {new Date(
                            transaction.borrowDate,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Book className="h-3 w-3" />
                        <span>ISBN: {transaction.book.isbn}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => handleReturnBook(transaction.book.id)}
                  disabled={isReturning}
                  className="w-full"
                  variant="outline"
                >
                  {isReturning ? "Returning..." : "Return Book"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
