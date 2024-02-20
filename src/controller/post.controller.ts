import { PrismaClient } from "@prisma/client";
import { error } from "console";
import { NextFunction, Request, Response } from "express";
import CustomRequest from "../types/customeRequests";
let prisma = new PrismaClient()

type createPostBody = { title: string, content: string }

class PostController {
    async create(req: CustomRequest, res: Response, next: NextFunction){
        try {
            let { title, content }: createPostBody = req.body
            if (typeof title !== 'string' || typeof content !== 'string' || title.trim() === '' || content.trim() === '') {
                return res.status(422).json({
                    success: false,
                    data: null,
                    errror: {
                        message: "fill all inputs"
                    }
                })
            }
            let post = await prisma.blog.create({
                data: {
                    content,
                    title,
                    authorId: req.user.id
                }
            })
            return res.status(201).json({
                success: true,
                data: {
                    message: "post created",
                    id: post.id
                },
                error: null
            })

        } catch (error) {
            console.log(error);
            next(error)
        }
    }
    async getBlogs(req: Request, res: Response, next: NextFunction) {
            try {
                let blogs = await prisma.blog.findMany({
                    include: {
                        author: {
                            select: {
                                username: true
                            }
                        }
                    }
                });
                return res.status(200).json({
                    error : null,
                    success :true,
                    data : {
                        blogs
                    }
                })
            } catch (error) {
                next(error)
            }
    }
}

export default new PostController