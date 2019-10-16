import mongoose from "mongoose";

export type BookDocument = mongoose.Document & {
  title: string;
  author: string;
  pageCount: number;
  currentPage: number;
  medium: string;
  genre: string;
};

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  author: { type: String, required: true },
  pageCount: { type: Number, required: true },
  currentPage: {
    type: Number,
    required: true,
    default: 0,
  },
  medium: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  url: String,
});

export const Book = mongoose.model<BookDocument>("Book", bookSchema);
