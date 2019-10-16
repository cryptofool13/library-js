import { Request, Response, NextFunction } from "express";
import { Book } from "../models/book";

export interface UpdateParams {
  url?: string;
  currentPage?: number;
}

export const addBook = (req: Request, res: Response) => {
  if (!req.body.title || !req.body.author || !req.body.medium) {
    return res.status(422).send({
      error:
        "must send book data on req.body, includeing title, author and medium",
    });
  }
  let body = req.body;
  let book = new Book({
    title: body.title,
    author: body.author,
    medium: body.medium,
    pageCount: body.pageCount,
    genre: body.genre,
  })
    .save()
    .then(doc => {
      return res.send({ message: doc });
    })
    .catch(err => {
      if (err) return res.send({ error: err });
    });
};

export const removeBook = (req: Request, res: Response) => {
  if (!req.params)
    return res.status(422).send({ error: "must supply book id" });
  let id = req.params.id;
  Book.findByIdAndDelete(id)
    .then(doc => {
      if (doc) return res.send({ message: "book removed" });
      res.send({ message: "book does not exist" });
    })
    .catch(e => {
      res.send({ error: e });
    });
};

export const getAllBooks = (req: Request, res: Response) => {
  Book.find().then(docs => {
    res.send({ docs });
  }).catch(e => {
      res.send({error: e})
  });
};

export const updateBook = (req: Request, res: Response) => {
  if (!req.params)
    return res.status(422).send({ error: "must supply book id" });
  let id = req.params.id;
  if (!req.body)
    return res.status(422).send({ error: "must supply update parameters" });
  let updateParams: UpdateParams = req.body;
  
  Book.findByIdAndUpdate(id, updateParams).then(doc => {
      Book.findById(id).then(doc => res.send({doc}))
  }).catch(e => {
      res.send({error: e})
  })
};
