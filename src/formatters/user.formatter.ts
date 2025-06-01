import { IUserDTO } from "@/dtos/user.dto";
import { IUser } from "@/types/user";

export const formatIUser = (user: IUser): IUserDTO => {
    return ({
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
        createdAt: user.createdAt
    });
};
