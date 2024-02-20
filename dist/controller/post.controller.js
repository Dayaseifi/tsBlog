"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
let prisma = new client_1.PrismaClient();
class PostController {
    async create(req, res, next) {
        try {
            let { title, content } = req.body;
            if (typeof title !== 'string' || typeof content !== 'string' || title.trim() === '' || content.trim() === '') {
                return res.status(422).json({
                    success: false,
                    data: null,
                    errror: {
                        message: "fill all inputs"
                    }
                });
            }
            let post = await prisma.blog.create({
                data: {
                    content,
                    title,
                    authorId: req.user.id
                }
            });
            return res.status(201).json({
                success: true,
                data: {
                    message: "post created",
                    id: post.id
                },
                error: null
            });
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
    async getBlogs(req, res, next) {
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
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getBlog(req, res, next) {
        try {
            let id = req.params.id;
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
            });
            return res.status(200).json({
                success: true,
                error: null,
                data: {
                    blog
                }
            });
        }
        catch (error) {
        }
    }
    async editBlog(req, res, next) {
        try {
            let userID = req.user.id;
            let blogID = req.params.id;
            let { title, content } = req.body;
            let blog = await prisma.blog.findFirst({
                where: {
                    id: +blogID
                }
            });
            if (!blog) {
                return res.status(404).json({
                    success: false,
                    data: null,
                    error: {
                        message: "blog doesnt find",
                    }
                });
            }
            if (blog?.authorId != userID) {
                return res.status(401).json({
                    success: false,
                    data: null,
                    error: {
                        message: "user does not  have permission for update this blog",
                    }
                });
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
            });
            return res.status(200).json({
                success: true,
                error: null,
                data: {
                    message: "post updated",
                    id: newBlog.id
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = new PostController;
