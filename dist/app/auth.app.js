"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
let prisma = new client_1.PrismaClient();
class authLogic {
    SignUp(signUpModel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = {
                    email: signUpModel.email,
                    password: signUpModel.password,
                    username: signUpModel.username,
                    roleId: 1
                };
                let user = yield prisma.user.create({
                    data
                });
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    FindUserByEmail(signInModel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield prisma.user.findFirst({
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
        });
    }
    PasswordsCompare(userPassword, comingPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let compareStatus = yield bcryptjs_1.default.compare(comingPassword, userPassword);
                return compareStatus;
            }
            catch (error) {
                throw error;
            }
        });
    }
    generateAccessToken(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return jsonwebtoken_1.default.sign(payload, process.env.JWT_ACCESS_KEY, {
                expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE
            });
        });
    }
    generateRefereshToken(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return jsonwebtoken_1.default.sign(payload, process.env.JWT_ACCESS_KEY, {
                expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE
            });
        });
    }
    updateRefereshTokenAtDB(id, refereshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield prisma.user.update({
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
        });
    }
    checkUserByRefereshToken(id, roleId, username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let intID = +id;
                let intRoleId = +roleId;
                let user = yield prisma.user.findFirst({
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
        });
    }
    logOut(res, id) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
}
exports.default = new authLogic;
