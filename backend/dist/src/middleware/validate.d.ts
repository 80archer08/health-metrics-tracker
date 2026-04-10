import type { NextFunction, Request, Response } from "express";
import { ZodTypeAny } from "zod";
export declare const validate: (schema: ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=validate.d.ts.map