import { z } from "zod";

export const bookFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
  author: z.string().min(1, "Author is required").max(255, "Author is too long"),
  isbn: z.string().min(1, "ISBN is required").max(50, "ISBN is too long"),
  publicationYear: z.coerce
    .number()
    .min(1000, "Year must be at least 1000")
    .max(new Date().getFullYear() + 10, "Year cannot be too far in the future"),
  coverImage: z
    .any()
    .optional()
    .refine(
      (files) => {
        if (!files || files.length === 0) return true;
        return files[0]?.size <= 5000000;
      },
      "File size must be less than 5MB"
    )
    .refine(
      (files) => {
        if (!files || files.length === 0) return true;
        return ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          files[0]?.type
        );
      },
      "File must be a valid image (JPEG, PNG, WebP)"
    ),
});

export type BookFormData = z.infer<typeof bookFormSchema>;