"use client";

import { useState } from "react";
import { useGetBooksQuery, useDeleteBookMutation } from "@/service/book";
import { DataTable } from "./data-table";
import { createColumns } from "./columns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BookDialog } from "@/components/BookDialog";
import { DeleteBookDialog } from "@/components/DeleteBookDialog";
import { Book } from "@/types/book";
import { Plus } from "lucide-react";

export default function BooksPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingBook, setDeletingBook] = useState<Book | null>(null);
  const limit = 10;

  const { data, isLoading, error } = useGetBooksQuery({
    page,
    limit,
    search,
  });

  const [deleteBook, { isLoading: isDeleting }] = useDeleteBookMutation();

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handlePreviousPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    if (data?.pagination.pages && page < data.pagination.pages) {
      setPage((prev) => prev + 1);
    }
  };

  const handleCreateBook = () => {
    setDialogMode("create");
    setEditingBook(null);
    setDialogOpen(true);
  };

  const handleEditBook = (book: Book) => {
    setDialogMode("edit");
    setEditingBook(book);
    setDialogOpen(true);
  };

  const handleDeleteBook = (book: Book) => {
    setDeletingBook(book);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingBook) return;

    try {
      await deleteBook(deletingBook.id).unwrap();
      setDeleteDialogOpen(false);
      setDeletingBook(null);
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const columns = createColumns({
    onEdit: handleEditBook,
    onDelete: handleDeleteBook,
  });

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Books</h1>
        <div className="text-red-500">
          Error loading books. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Books Library</h1>
        <Button onClick={handleCreateBook}>
          <Plus className="mr-2 h-4 w-4" />
          Add Book
        </Button>
      </div>

      {/* Server-side Search */}
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Search books by title or author"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="max-w-md"
        />
        <Button onClick={handleSearch}>Search</Button>
        {search && (
          <Button
            variant="outline"
            onClick={() => {
              setSearch("");
              setSearchInput("");
              setPage(1);
            }}
          >
            Clear
          </Button>
        )}
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-96 w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-6 w-48" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Data Table */}
          <DataTable columns={columns} data={data?.data || []} />

          {/* Server-side Pagination */}
          {data?.pagination && data.pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Page {data.pagination.page} of {data.pagination.pages} (
                {data.pagination.total} total books)
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handlePreviousPage}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={handleNextPage}
                  disabled={page >= data.pagination.pages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Book Dialog */}
      <BookDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        book={editingBook}
        mode={dialogMode}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteBookDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        book={deletingBook}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
