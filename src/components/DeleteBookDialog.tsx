"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Book } from "@/types/book";
import { AlertTriangle } from "lucide-react";

interface DeleteBookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book: Book | null;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DeleteBookDialog({
  open,
  onOpenChange,
  book,
  onConfirm,
  isLoading = false,
}: DeleteBookDialogProps) {
  if (!book) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-100 p-2 dark:bg-red-900/20">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <DialogTitle>Delete Book</DialogTitle>
              <DialogDescription className="mt-1">
                This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this book?
          </p>
          <div className="mt-3 rounded-lg bg-muted p-3">
            <p className="font-medium">{book.title}</p>
            <p className="text-sm text-muted-foreground">by {book.author}</p>
            <p className="text-xs text-muted-foreground mt-1">ISBN: {book.isbn}</p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete Book"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}