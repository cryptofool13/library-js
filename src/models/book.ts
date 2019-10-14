import mongoose from "mongoose";

export type BookDocument = mongoose.Document & {
  title: string;
  author: string;
  pageCount: number;
  medium: string;
  genre: string;
};

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  author: { type: String, required: true },
  pageCount: Number,
  medium: {
    type: String,
    required: true,
  },
  genre: String,
  url: String,
});

export const Book = mongoose.model<BookDocument>("Book", bookSchema);
