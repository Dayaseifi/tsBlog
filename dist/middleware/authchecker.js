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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_app_1 = __importDefault(require("../app/auth.app"));
function authChecker(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //bearer token
            let authheader = req.headers.authorization;
            if (!authheader) {
                return res.status(401).json({
                    success: false,
                    error: {
                        message: "auth header doesnt find"
                    },
                    data: null
                });
            }
            //['bearer' , 'token']
            let tokenParts = authheader.split(' ');
            if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
                return res.status(400).json({
                    success: false,
                    data: null,
                    error: {
                        message: 'Invalid token format'
                    }
                });
            }
            const token = tokenParts[1];
            jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_KEY, (err, decoded) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    return next(err);
                }
                // solve ts error
                if (typeof decoded === 'object' && decoded !== null) {
                    const { username, id, roleId } = decoded;
                    let user = yield auth_app_1.default.checkUserByRefereshToken(id, roleId, username);
                    if (!user) {
                        return res.status(404).json({
                            success: false,
                            data: null,
                            error: {
                                message: "user not found , please relogin again"
                            }
                        });
                    }
                    let cookie = req.cookies;
                    let refereshToken = cookie.refreshToken;
                    console.log(refereshToken);
                    if (!refereshToken) {
                        yield auth_app_1.default.logOut(res, user.id);
                        return res.status(401).json({
                            success: false,
                            data: null,
                            error: {
                                message: 'user logout succesfully',
                                token: ''
                            }
                        });
                    }
                    //user may changed its refereshToken
                    if (user.refereshtoken != refereshToken) {
                        return res.status(401).json({
                            success: false,
                            data: null,
                            error: {
                                message: "refresh token change"
                            }
                        });
                    }
                    req.user = user;
                    next();
                }
                else {
                    return res.status(400).json({
                        success: false,
                        data: null,
                        error: {
                            message: 'Invalid token payload format'
                        }
                    });
                }
            }));
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    });
}
exports.default = authChecker;
