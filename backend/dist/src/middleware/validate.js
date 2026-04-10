"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const validate = (schema) => (req, res, next) => {
    try {
        req.body = schema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json({
                message: "Validation error",
                errors: error.issues,
            });
        }
        return res.status(500).json({ message: "Validation failed" });
    }
};
exports.validate = validate;
//# sourceMappingURL=validate.js.map