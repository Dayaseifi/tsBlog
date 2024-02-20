import { NextFunction, Request, Response, Router } from "express";
import authController from "../controller/auth.controller";
import authChecker from "../middleware/authchecker";

let router = Router()

// router.get('/test', authChecker as (req: Request, res: Response, next: NextFunction) => any , (req , res) => {res.status(200).json({one : 1})});

router.post("/signup" , authController.SignUp)

router.post("/signin" , authController.SignIn)

router.post("/refresh" , authController.Referesh as (req: Request, res: Response, next: NextFunction) => any)

router.put("/logout" , authController.Logout)

export default router;
