"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { bookFormSchema, type BookFormData } from "@/lib/validations/book";
import { Book } from "@/types/book";
import {
  useCreateBookMutation,
  useUpdateBookMutation,
} from "@/service/book";

interface BookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book?: Book | null;
  mode: "create" | "edit";
}

export function BookDialog({ open, onOpenChange, book, mode }: BookDialogProps) {
  const [createBook, { isLoading: isCreating }] = useCreateBookMutation();
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();

  const form = useForm<BookFormData>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      title: "",
      author: "",
      isbn: "",
      publicationYear: new Date().getFullYear(),
    },
  });

  useEffect(() => {
    if (mode === "edit" && book) {
      form.reset({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        publicationYear: book.publicationYear,
      });
    } else if (mode === "create") {
      form.reset({
        title: "",
        author: "",
        isbn: "",
        publicationYear: new Date().getFullYear(),
      });
    }
  }, [book, mode, form]);

  const onSubmit = async (data: BookFormData) => {
    try {
      const coverImageFile = data.coverImage?.[0] || undefined;

      if (mode === "create") {
        await createBook({
          title: data.title,
          author: data.author,
          isbn: data.isbn,
          publicationYear: data.publicationYear,
          coverImage: coverImageFile,
        }).unwrap();
      } else if (mode === "edit" && book) {
        await updateBook({
          id: book.id,
          data: {
            title: data.title,
            author: data.author,
            isbn: data.isbn,
            publicationYear: data.publicationYear,
            coverImage: coverImageFile,
          },
        }).unwrap();
      }

      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving book:", error);
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add New Book" : "Edit Book"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter book title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter author name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isbn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ISBN</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter ISBN" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="publicationYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Publication Year</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter publication year"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coverImage"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Cover Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => onChange(e.target.files)}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? mode === "create"
                    ? "Creating..."
                    : "Updating..."
                  : mode === "create"
                  ? "Create Book"
                  : "Update Book"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}