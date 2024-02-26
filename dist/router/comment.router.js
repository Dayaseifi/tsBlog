"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comment_controller_1 = __importDefault(require("../controller/comment.controller"));
const authchecker_1 = __importDefault(require("../middleware/authchecker"));
let Commentrouter = (0, express_1.Router)();
Commentrouter.get("/get/:id", comment_controller_1.default.getcommentsOfBlog);
Commentrouter.post('/create/:id', authchecker_1.default, comment_controller_1.default.create);
exports.default = Commentrouter;
