"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const errorHandler_1 = __importDefault(require("./exceptions/errorHandler"));
const auth_router_1 = __importDefault(require("./router/auth.router"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const blog_router_1 = __importDefault(require("./router/blog.router"));
const landing_controller_1 = require("./controller/landing.controller");
dotenv_1.default.config({
    path: '../.env'
});
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(auth_router_1.default);
app.use('/blog', blog_router_1.default);
app.use('/', landing_controller_1.landingPage);
app.use(errorHandler_1.default.unexceptionError);
app.use(errorHandler_1.default.error404);
app.listen(process.env.PORT, () => {
    console.log(`project run on port ${process.env.PORT}`);
});
