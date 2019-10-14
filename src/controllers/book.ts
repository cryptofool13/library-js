import { Request, Response, NextFunction } from "express";
import { Book } from "../models/book";

export const addBook = (req: Request, res: Response) => {
    if(!req.body.title || !req.body.author ||!req.body.medium) {
        return res.status(422).send({error: "must send book data on req.body, includeing title, author and medium"})
    }
    let body = req.body
    let book = new Book({ title: body.title, author: body.author, medium: body.medium }).save().then(doc => {

        return res.send({message: doc})
    }).catch(err => {
        if(err) return res.send({error: err})
    })
};

export const removeBook = (req: Request, res: Response) => {
    if(!req.params) return res.status(422).send({error: 'must supply book id'})
    let id = req.params.id;
    Book.findByIdAndDelete(id).then(() => {
        res.send({message: 'book removed'})
    })
}
