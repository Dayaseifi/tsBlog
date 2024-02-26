import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import CustomRequest from "../types/customeRequests";
import { createPostBody } from "../types/blogs/post.types";
let prisma = new PrismaClient()


class PostController {
    async create(req: CustomRequest, res: Response, next: NextFunction) {
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
                error: null,
                success: true,
                data: {
                    blogs
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async getBlog(req: Request, res: Response, next: NextFunction) {
        try {
            let id = req.params.id
            let blog = await prisma.blog.findFirst({
                where: {
                    id: +id
                },
                include: {
                    author: {
                        select: {
                            username: true
                        }
                    }
                }
            })
            return res.status(200).json({
                success: true,
                error: null,
                data: {
                    blog
                }
            })
        } catch (error) {

        }
    }
    async editBlog(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            let userID = req.user.id
            let blogID = req.params.id
            let { title, content }: createPostBody = req.body
            let blog = await prisma.blog.findFirst({
                where: {
                    id: +blogID
                }
            })
            if (!blog) {
                return res.status(404).json({
                    success: false,
                    data: null,
                    error: {
                        message: "blog doesnt find",

                    }
                })
            }
            if (blog?.authorId != userID) {
                return res.status(401).json({
                    success: false,
                    data: null,
                    error: {
                        message: "user does not  have permission for update this blog",
                    }
                })
            }
            let newBlog = await prisma.blog.update({
                where: {
                    id: +blogID
                },
                data: {
                    title: {
                        set: title
                    },
                    content: {
                        set: content
                    }
                }

            })
            return res.status(200).json({
                success: true,
                error: null,
                data: {
                    message: "post updated",
                    id: newBlog.id
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async deleteBlog(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            let blogID = req.params.id
            let userID = req.user.id
            let blog = await prisma.blog.findFirst({
                where: {
                    id: +blogID
                }
            })
            if (!blog) {
                return res.status(404).json({
                    success: false,
                    error: {
                        message: "there is not any blog"
                    },
                    data: null
                })
            }
            await prisma.blog.delete({
                where: {
                    id: +blogID
                }
            })
            return res.status(200).json({
                success: true,
                error: null,
                data: {
                    message: "delete succesfully"
                }
            })
        } catch (error) {

        }

    }
}

export default new PostController