"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const post_controller_1 = __importDefault(require("../controller/post.controller"));
const authchecker_1 = __importDefault(require("../middleware/authchecker"));
const post_controller_2 = __importDefault(require("../controller/post.controller"));
const router = (0, express_1.Router)();
router.get("/", post_controller_1.default.getBlogs);
router.get("/:id", post_controller_1.default.getBlog);
router.put("/edit/:id", authchecker_1.default, post_controller_1.default.editBlog);
router.post("/create", authchecker_1.default, post_controller_1.default.create);
router.delete("/delete/:id", authchecker_1.default, post_controller_2.default.deleteBlog);
exports.default = router;
