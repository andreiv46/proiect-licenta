import { Request } from "express";
import { UserWithoutPassword } from "../models/user.model";

export interface ExtendedRequest<P = {}, ResBody = any, ReqBody = any>
    extends Request<P, ResBody, ReqBody> {
    user?: UserWithoutPassword;
}
