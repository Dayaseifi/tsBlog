import { NextFunction, Request, Response } from "express";
import { SignUpDTO, SignInDTO } from "../dto/auth/auth.dto";
import authApp from "../app/auth.app";
import bcryptjs from "bcryptjs";
import { CustomError } from "../exceptions/errorHandler";
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken'
import CustomRequest from "../types/customeRequests";

let prisma = new PrismaClient()

interface DecodedToken {
    username: string;
    id: string;
    roleId: string;
}

class authController {
    async SignUp(req: Request, res: Response, next: NextFunction) {

        let { email, username, password } = req.body
        password = await bcryptjs.hash(password, 10)
        let signUpModel: SignUpDTO = {
            email,
            username,
            password
        };
        let user = await authApp.SignUp(signUpModel)
        return res.status(201).json({
            success: true,
            error: null,
            data: {
                id: user.id,
                message: "user created succesfully"
            }
        })
    }
    async SignIn(req: Request, res: Response, next: NextFunction) {
        try {
            let { email, password } = req.body
            let signInModel: SignInDTO = {
                email, password
            }
            let user = await authApp.FindUserByEmail(signInModel)
            if (!user) {
                let error = new CustomError("user doesnt find", 404)
                throw error
            }
            let isComparePasswords: boolean = await authApp.PasswordsCompare(user.password, signInModel.password)
            console.log(isComparePasswords);
            if (!isComparePasswords) {
                let error = new CustomError("Passwords are not equal", 400)
                throw error
            }
            let { roleId } = user
            let payload = {
                username: user.username,
                id: user.id,
                roleId
            }
            let accessToken = await authApp.generateAccessToken(payload)
            let refereshToken = await authApp.generateRefereshToken(payload)
            res.cookie('refreshToken', refereshToken, {

                sameSite: "none"
            })
            await authApp.updateRefereshTokenAtDB(user.id, refereshToken)
            return res.status(200).json({
                success: true,
                error: null,
                data: {
                    message: 'successfull signin',
                    token: accessToken,
                    role : user.role.name
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async Referesh(req: CustomRequest, res: Response, next: NextFunction) {
        let cookies = req.cookies
        let refereshToken = cookies?.refreshToken
        if (!refereshToken) {
            return res.status(401).json({
                success: false,
                error: {
                    message: "cookie doesnt find"
                },
                data: null
            })
        }
        jwt.verify(refereshToken, process.env.JWT_ACCESS_KEY!, async (err: Error | null, decoded: unknown) => {
            if (typeof decoded === 'object' && decoded !== null) {
                const { username, id, roleId } = decoded as DecodedToken;
                let user = await prisma.user.findFirst({
                    where: {
                        refereshtoken: refereshToken,
                        roleId: +roleId,
                        id: +id,
                        username
                    }
                })
                if (!user) {
                    return res.status(404).json({
                        success: false,
                        data: null,
                        error: {
                            message: "user not found , please relogin again"
                        }
                    })
                }
                let payload = {
                    username: user.username,
                    id: user.id,
                    roleId
                }
                let newtoken = await authApp.generateRefereshToken(payload)
                req.user = user
                return res.status(421).json({
                    success: false,
                    data: {
                        message: "New access token generated successfully",
                        newtoken
                    },
                    error: null
                })
            }
        })
    }
    async Logout(req: Request, res: Response, next: NextFunction) {
        try {
            let cookie = req.cookies
            let refereshToken = cookie.refreshToken
            console.log(refereshToken);
            if (refereshToken) {
                let user = await prisma.user.findFirst({
                    where: {
                        refereshtoken: refereshToken
                    }
                })
                if (user) {
                    await authApp.logOut(res, user.id)
                    return res.status(401).json({
                        success: true,
                        data: {
                            message: 'user logout succesfully',
                            token: ''
                        },
                        error: null
                    })
                }
                else {
                    return res.status(404).json({
                        success: false,
                        error: { message: 'i can not find any user' },
                        data: null
                    })
                }

            }
        } catch (error) {

        }
    }

}

export default new authController