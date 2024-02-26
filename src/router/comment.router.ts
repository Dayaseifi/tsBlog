import { NextFunction, Request, Response, Router } from "express";
import commentController from "../controller/comment.controller";
import authChecker from "../middleware/authchecker";

let Commentrouter = Router()

Commentrouter.get("/get/:id" ,  commentController.getcommentsOfBlog as (req: Request, res: Response, next: NextFunction) => any)


Commentrouter.post('/create/:id' , authChecker as (req: Request, res: Response, next: NextFunction) => any, commentController.create as (req: Request, res: Response, next: NextFunction) => any)


export default Commentrouter