"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.landingPage = void 0;
const client_1 = require("@prisma/client");
let prisma = new client_1.PrismaClient();
async function landingPage(req, res, next) {
    try {
        let newBlogs = await prisma.blog.findMany({
            orderBy: {
                createdAt: 'asc'
            }
        });
        let oldBlogs = newBlogs.reverse();
        return res.status(200).json({
            success: false,
            error: null,
            data: {
                oldBlogs,
                newBlogs
            }
        });
    }
    catch (error) {
        next(error);
    }
}
exports.landingPage = landingPage;
