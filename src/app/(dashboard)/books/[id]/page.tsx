"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetBookQuery, useDeleteBookMutation } from "@/service/book";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookDialog } from "@/components/BookDialog";
import { DeleteBookDialog } from "@/components/DeleteBookDialog";
import { ArrowLeft, Edit, Trash2, Calendar, User, Hash, BookOpen } from "lucide-react";
import Image from "next/image";

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = parseInt(params.id as string, 10);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: book, isLoading, error } = useGetBookQuery(bookId);
  const [deleteBook, { isLoading: isDeleting }] = useDeleteBookMutation();

  const handleEdit = () => {
    setDialogOpen(true);
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!book) return;
    
    try {
      await deleteBook(book.id).unwrap();
      setDeleteDialogOpen(false);
      router.push("/books");
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Skeleton className="w-full h-96" />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Book Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The book you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => router.push("/books")}>
            Go to Books Library
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Books</span>
            <span>/</span>
            <span className="text-foreground">{book.title}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Book Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cover Image */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="aspect-[3/4] w-full bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                {book.coverImage ? (
                  <Image
                    src={book.coverImage}
                    alt={`${book.title} cover`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 300px"
                  />
                ) : (
                  <div className="text-center">
                    <BookOpen className="h-16 w-16 text-muted-foreground/50 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No cover image</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Book Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title and Author */}
          <div>
            <h1 className="text-4xl font-bold mb-2">{book.title}</h1>
            <p className="text-xl text-muted-foreground mb-4">by {book.author}</p>
            <Badge variant="secondary" className="text-sm">
              Published {book.publicationYear}
            </Badge>
          </div>

          {/* Book Details Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  ISBN
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-mono text-sm">{book.isbn}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Publication Year
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{book.publicationYear}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Author
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{book.author}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Added to Library
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{new Date(book.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Book Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Book ID:</span>
                  <span className="ml-2 font-medium">#{book.id}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span className="ml-2">{new Date(book.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Dialog */}
      <BookDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        book={book}
        mode="edit"
      />

      {/* Delete Confirmation Dialog */}
      <DeleteBookDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        book={book}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}