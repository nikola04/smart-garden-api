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
        const userFormated = ({ id: user.id, name: user.name, avatar: user.avatar, email: user.email, createdAt: user.createdAt });

        responseHelper.success({ res, message: "Found user successfully.", data: { user: userFormated } });
    }catch(err){
        if(err instanceof Error){
            if(err.message === "user not found")
                return responseHelper.error({ res, code: 404, message: "User not found." });
        }

        responseHelper.error({ res, code: 500, message: "Internal server error." });
    }
};
