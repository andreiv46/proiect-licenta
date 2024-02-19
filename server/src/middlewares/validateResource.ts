import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";
import logger from "../utils/logger";

export const validate =
    (schema: AnyZodObject) =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsedData = schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            req.body = parsedData.body;
            req.query = parsedData.query;
            req.params = parsedData.params;
            return next();
        } catch (e: any) {
            logger.error(e.errors);
            return res.status(400).json({ message: e.errors });
        }
    };
