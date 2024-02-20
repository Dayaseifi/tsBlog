import { PrismaClient } from "@prisma/client";
import { SignUpDTO, SignInDTO } from "../dto/auth/auth.dto";
import { CustomError } from "../exceptions/errorHandler";
import jwt from 'jsonwebtoken'
import bcryptjs from "bcryptjs";
import { Response } from "express";

let prisma = new PrismaClient()


class authLogic {
    async SignUp(signUpModel: SignUpDTO) {
        try {
            let data = {
                email: signUpModel.email,
                password: signUpModel.password,
                username: signUpModel.username,
                roleId: 1
            }
            let user = await prisma.user.create({
                data
            })
            return user
        } catch (error) {
            throw error;
        }
    }
    async FindUserByEmail(signInModel: SignInDTO) {
        try {
            let user = await prisma.user.findFirst({
                where: {
                    email: signInModel.email
                },
                include : {
                    role : true
                }
            })
            return user;
        } catch (error) {
            throw error
        }
    }
    async PasswordsCompare(userPassword: string, comingPassword: string) {
        try {
            let compareStatus = await bcryptjs.compare(comingPassword, userPassword)
            return compareStatus
        } catch (error) {
            throw error;
        }
    }
    async generateAccessToken(payload: object) {

        return jwt.sign(payload, process.env.JWT_ACCESS_KEY!, {
            expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE
        });
    }
    async generateRefereshToken(payload: object) {
        return jwt.sign(payload, process.env.JWT_ACCESS_KEY!, {
            expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE
        });
    }
    async updateRefereshTokenAtDB(id: number, refereshToken: string) {
        try {
            await prisma.user.update({
                where: {
                    id
                },
                data: {
                    refereshtoken: {
                        set: refereshToken
                    }
                }
            })
            return true;
        } catch (error) {
            throw error;
        }
    }
    async checkUserByRefereshToken(id: string, roleId: string, username: string) {
        try {
            let intID = +id
            let intRoleId = +roleId
            let user = await prisma.user.findFirst({
                where: {
                    username,
                    roleId: intRoleId,
                    id: intID
                }
            })
            return user
        } catch (error) {
            throw error;
        }
    }
    async logOut(res: Response, id: number){
        try {
            res.clearCookie('refreshToken')
            prisma.user.update({
                where: {
                    id
                },
                data: {
                    refereshtoken: { set: null }
                }
            })
            return ''
        } catch (error) {
           throw error;
        }
    }

}

export default new authLogic