import { logger } from "@/configs/logger.config";
import { formatIUser } from "@/formatters/user.formatter";
import responseHelper from "@/helpers/response.helper";
import { AuthRequest } from "@/middlewares/authenticate";
import { UserService } from "@/services/user.service";
import { Response } from "express";

const userService = new UserService();

export const userMeController = async (req: AuthRequest, res: Response): Promise<void> => {
    try{
        if(!req.user)
            return responseHelper.error({ res, code: 401, message: "Unauthorized." });

        const user = await userService.getUserById(req.user.id);
        const userFormated = formatIUser(user);

        responseHelper.success({ res, message: "Found user successfully.", data: { user: userFormated } });
    }catch(err){
        if(err instanceof Error){
            if(err.message === "user not found")
                return responseHelper.error({ res, code: 404, message: "User not found." });
        }
        logger.error(`[userMeController] ${err}`);
        responseHelper.error({ res, code: 500, message: "Internal server error." });
    }
};
