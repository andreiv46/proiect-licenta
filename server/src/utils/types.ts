import { Request } from "express";
import { UserWithoutPassword } from "../models/user.model";

export interface ExtendedRequest<
    P = {},
    ResBody = any,
    ReqBody = any,
    ReqQuery = qs.ParsedQs
> extends Request<P, ResBody, ReqBody, ReqQuery> {
    user?: UserWithoutPassword;
}
