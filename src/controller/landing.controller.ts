import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
let prisma = new PrismaClient()

export async function landingPage(req: Request, res: Response, next: NextFunction) {
    try {
        let newBlogs = await prisma.blog.findMany({
            orderBy: {
                createdAt: 'asc'
            }
        })
        let oldBlogs = newBlogs.reverse()
        return res.status(200).json({
            success: false,
            error: null,
            data: {
                oldBlogs,
                newBlogs
            }
        })
    } catch (error) {
        next(error)
    }
}