"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processProductImage = exports.uploadBufferToCloudinary = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const sharp_1 = __importDefault(require("sharp"));
const AppError_js_1 = require("../utils/AppError.js");
const cloudinary_js_1 = __importDefault(require("../lib/cloudinary.js"));
const storage = multer_1.default.memoryStorage();
exports.upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            return cb(new AppError_js_1.AppError("Only image files are allowed", 400), false);
        }
        cb(null, true);
    },
});
const uploadBufferToCloudinary = (buffer, folder = "products") => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary_js_1.default.uploader.upload_stream({
            folder,
            resource_type: "image",
            overwrite: true,
            invalidate: true,
        }, (err, result) => {
            if (err)
                return reject(err);
            resolve(result);
        });
        stream.end(buffer);
    });
};
exports.uploadBufferToCloudinary = uploadBufferToCloudinary;
const processProductImage = async (req, _res, next) => {
    try {
        if (!req.file)
            return next();
        const file = req.file;
        const processedBuffer = await (0, sharp_1.default)(file.buffer)
            .resize(1000, 1000, {
            fit: "cover",
            position: "center",
        })
            .sharpen()
            .toFormat("webp")
            .webp({ quality: 90 })
            .toBuffer();
        const result = await (0, exports.uploadBufferToCloudinary)(processedBuffer, "products");
        req.body.imageUrl = result.secure_url;
        req.body.imagePublicId = result.public_id;
        next();
    }
    catch (err) {
        console.error("PRODUCT IMAGE ERROR:", err);
        next(new AppError_js_1.AppError("Failed to process product image", 500));
    }
};
exports.processProductImage = processProductImage;
//# sourceMappingURL=uploadImages.js.map