"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_app_1 = __importDefault(require("../app/auth.app"));
async function authChecker(req, res, next) {
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
        jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_KEY, async (err, decoded) => {
            if (err) {
                return next(err);
            }
            // solve ts error
            if (typeof decoded === 'object' && decoded !== null) {
                const { username, id, roleId } = decoded;
                let user = await auth_app_1.default.checkUserByRefereshToken(id, roleId, username);
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
                    await auth_app_1.default.logOut(res, user.id);
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
        });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}
exports.default = authChecker;
