import { NextFunction, Request, Response } from "express";

class PostController{
    create(req : Request , res : Response , next : NextFunction){
        let {title,content} = req.body
        
    }
}