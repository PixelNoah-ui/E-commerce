"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictTo = void 0;
const AppError_js_1 = require("../utils/AppError.js");
const catchAsync__js_1 = require("../utils/catchAsync .js");
const restrictTo = (...roles) => (0, catchAsync__js_1.catchAsync)(async (req, res, next) => {
    if (!req.user) {
        return next(new AppError_js_1.AppError("You are not logged in", 401));
    }
    if (!roles.includes(req.user.role)) {
        return next(new AppError_js_1.AppError("You do not have permission to perform this action", 403));
    }
    next();
});
exports.restrictTo = restrictTo;
//# sourceMappingURL=auth.js.map