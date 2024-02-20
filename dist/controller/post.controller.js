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
}
exports.default = new PostController;
