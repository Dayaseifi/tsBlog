"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
let prisma = new client_1.PrismaClient();
class commentController {
    async create(req, res, next) {
        try {
            const { content, parentID } = req.body;
            const userID = req.user.id;
            const blogID = parseInt(req.params.id); // Get the blog ID from request params and convert to number
            console.log('UserID:', userID);
            console.log('BlogID:', blogID);
            const createComment = await prisma.comment.create({
                data: {
                    content,
                    authorId: userID,
                    blogId: blogID,
                    parentId: parentID === 0 ? null : parentID
                }
            });
            return res.status(201).json({
                success: true,
                data: {
                    comment: createComment.id,
                    message: "comment created"
                },
                error: null
            });
        }
        catch (error) {
            console.error('Error creating comment:', error);
            next(error);
        }
    }
    async getcommentsOfBlog(req, res, next) {
        try {
            let BlogID = req.params.id;
            let comments = await prisma.comment.findMany({
                where: {
                    blogId: +BlogID
                },
                include: {
                    author: {
                        select: {
                            username: true
                        }
                    },
                    children: true,
                    likes: {
                        select: {
                            user: {
                                select: {
                                    username: true
                                }
                            }
                        }
                    }
                }
            });
            const commentsWithChildrenCount = comments.map(comment => {
                const childrenCount = comment.children.length;
                return { ...comment, childrenCount };
            });
            return res.status(200).json({
                data: {
                    comments: commentsWithChildrenCount
                },
                success: true,
                error: null
            });
        }
        catch (error) {
            next(error);
        }
    }
    async likeComment(req, res, next) {
        try {
        }
        catch (error) {
        }
    }
}
exports.default = new commentController;
