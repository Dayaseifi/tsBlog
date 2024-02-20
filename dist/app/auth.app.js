"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
let prisma = new client_1.PrismaClient();
class authLogic {
    async SignUp(signUpModel) {
        try {
            let data = {
                email: signUpModel.email,
                password: signUpModel.password,
                username: signUpModel.username,
                roleId: 1
            };
            let user = await prisma.user.create({
                data
            });
            return user;
        }
        catch (error) {
            throw error;
        }
    }
    async FindUserByEmail(signInModel) {
        try {
            let user = await prisma.user.findFirst({
                where: {
                    email: signInModel.email
                },
                include: {
                    role: true
                }
            });
            return user;
        }
        catch (error) {
            throw error;
        }
    }
    async PasswordsCompare(userPassword, comingPassword) {
        try {
            let compareStatus = await bcryptjs_1.default.compare(comingPassword, userPassword);
            return compareStatus;
        }
        catch (error) {
            throw error;
        }
    }
    async generateAccessToken(payload) {
        return jsonwebtoken_1.default.sign(payload, process.env.JWT_ACCESS_KEY, {
            expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE
        });
    }
    async generateRefereshToken(payload) {
        return jsonwebtoken_1.default.sign(payload, process.env.JWT_ACCESS_KEY, {
            expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE
        });
    }
    async updateRefereshTokenAtDB(id, refereshToken) {
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
            });
            return true;
        }
        catch (error) {
            throw error;
        }
    }
    async checkUserByRefereshToken(id, roleId, username) {
        try {
            let intID = +id;
            let intRoleId = +roleId;
            let user = await prisma.user.findFirst({
                where: {
                    username,
                    roleId: intRoleId,
                    id: intID
                }
            });
            return user;
        }
        catch (error) {
            throw error;
        }
    }
    async logOut(res, id) {
        try {
            res.clearCookie('refreshToken');
            prisma.user.update({
                where: {
                    id
                },
                data: {
                    refereshtoken: { set: null }
                }
            });
            return '';
        }
        catch (error) {
            throw error;
        }
    }
}
exports.default = new authLogic;
