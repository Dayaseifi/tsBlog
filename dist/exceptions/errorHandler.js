"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
class CustomError extends Error {
    constructor(message, status = 500) {
        super(message);
        this.status = status;
    }
}
exports.CustomError = CustomError;
class ErrorHandler {
    error404(req, res) {
        return res.status(404).json({
            success: false,
            data: null,
            error: {
                message: "route not found"
            }
        });
    }
    unexceptionError(err, req, res, next) {
        const statusCode = err.status || 500;
        const message = err.message || 'Internal Server Error';
        return res.status(statusCode).json({
            success: false,
            data: null,
            error: {
                message
            }
        });
    }
}
exports.default = new ErrorHandler();
