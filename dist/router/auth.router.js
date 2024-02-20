"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controller/auth.controller"));
let router = (0, express_1.Router)();
// router.get('/test', authChecker as (req: Request, res: Response, next: NextFunction) => any , (req , res) => {res.status(200).json({one : 1})});
router.post("/signup", auth_controller_1.default.SignUp);
router.post("/signin", auth_controller_1.default.SignIn);
router.post("/refresh", auth_controller_1.default.Referesh);
router.put("/logout", auth_controller_1.default.Logout);
exports.default = router;
