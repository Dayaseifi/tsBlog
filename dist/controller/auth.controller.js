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
const auth_app_1 = __importDefault(require("../app/auth.app"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const errorHandler_1 = require("../exceptions/errorHandler");
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
let prisma = new client_1.PrismaClient();
class authController {
    SignUp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let { email, username, password } = req.body;
            password = yield bcryptjs_1.default.hash(password, 10);
            let signUpModel = {
                email,
                username,
                password
            };
            let user = yield auth_app_1.default.SignUp(signUpModel);
            return res.status(201).json({
                success: true,
                error: null,
                data: {
                    id: user.id,
                    message: "user created succesfully"
                }
            });
        });
    }
    SignIn(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { email, password } = req.body;
                let signInModel = {
                    email, password
                };
                let user = yield auth_app_1.default.FindUserByEmail(signInModel);
                if (!user) {
                    let error = new errorHandler_1.CustomError("user doesnt find", 404);
                    throw error;
                }
                let isComparePasswords = yield auth_app_1.default.PasswordsCompare(user.password, signInModel.password);
                console.log(isComparePasswords);
                if (!isComparePasswords) {
                    let error = new errorHandler_1.CustomError("Passwords are not equal", 400);
                    throw error;
                }
                let { roleId } = user;
                let payload = {
                    username: user.username,
                    id: user.id,
                    roleId
                };
                let accessToken = yield auth_app_1.default.generateAccessToken(payload);
                let refereshToken = yield auth_app_1.default.generateRefereshToken(payload);
                res.cookie('refreshToken', refereshToken, {
                    sameSite: "none"
                });
                yield auth_app_1.default.updateRefereshTokenAtDB(user.id, refereshToken);
                return res.status(200).json({
                    success: true,
                    error: null,
                    data: {
                        message: 'successfull signin',
                        token: accessToken,
                        role: user.role.name
                    }
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    Referesh(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let cookies = req.cookies;
            let refereshToken = cookies === null || cookies === void 0 ? void 0 : cookies.refreshToken;
            if (!refereshToken) {
                return res.status(401).json({
                    success: false,
                    error: {
                        message: "cookie doesnt find"
                    },
                    data: null
                });
            }
            jsonwebtoken_1.default.verify(refereshToken, process.env.JWT_ACCESS_KEY, (err, decoded) => __awaiter(this, void 0, void 0, function* () {
                if (typeof decoded === 'object' && decoded !== null) {
                    const { username, id, roleId } = decoded;
                    let user = yield prisma.user.findFirst({
                        where: {
                            refereshtoken: refereshToken,
                            roleId: +roleId,
                            id: +id,
                            username
                        }
                    });
                    if (!user) {
                        return res.status(404).json({
                            success: false,
                            data: null,
                            error: {
                                message: "user not found , please relogin again"
                            }
                        });
                    }
                    let payload = {
                        username: user.username,
                        id: user.id,
                        roleId
                    };
                    let newtoken = yield auth_app_1.default.generateRefereshToken(payload);
                    req.user = user;
                    return res.status(421).json({
                        success: false,
                        data: {
                            message: "New access token generated successfully",
                            newtoken
                        },
                        error: null
                    });
                }
            }));
        });
    }
    Logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let cookie = req.cookies;
                let refereshToken = cookie.refreshToken;
                console.log(refereshToken);
                if (refereshToken) {
                    let user = yield prisma.user.findFirst({
                        where: {
                            refereshtoken: refereshToken
                        }
                    });
                    if (user) {
                        yield auth_app_1.default.logOut(res, user.id);
                        return res.status(401).json({
                            success: true,
                            data: {
                                message: 'user logout succesfully',
                                token: ''
                            },
                            error: null
                        });
                    }
                    else {
                        return res.status(404).json({
                            success: false,
                            error: { message: 'i can not find any user' },
                            data: null
                        });
                    }
                }
            }
            catch (error) {
            }
        });
    }
}
exports.default = new authController;
