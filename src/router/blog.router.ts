import { NextFunction, Request, Response, Router } from "express";
import blog from "../controller/post.controller";
import authChecker from "../middleware/authchecker";

const router = Router()

router.get("/" ,blog.getBlogs)

router.get("/:id" ,blog.getBlog)

router.put("/edit/:id" , authChecker as (req: Request, res: Response, next: NextFunction) => any , blog.editBlog as (req: Request, res: Response, next: NextFunction) => any)


router.post("/create" , authChecker as (req: Request, res: Response, next: NextFunction) => any ,blog.create as (req: Request, res: Response, next: NextFunction) => any)



export default router
