import { NextFunction, Response } from "express";
import { ExtendedRequest } from "../utils/types";
import { getPersonalPaymentsOverview } from "../service/analytics.service";

export async function getPersonalPaymentsOverviewHandler(
    req: ExtendedRequest,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    try {
        const personalPaymentsOverview = await getPersonalPaymentsOverview(
            req.user?.id!
        );
        console.log(personalPaymentsOverview);
        return res.json(personalPaymentsOverview);
    } catch (error: unknown) {
        next(error);
    }
}
