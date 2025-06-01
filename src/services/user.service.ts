import { IUser } from "@/types/user";
import { UserRepository } from "../repositories/user.repository";

export class UserService{
    private userRepository: UserRepository;
    constructor(){
        this.userRepository = new UserRepository();
    }

    public async getUserById(userId: string): Promise<IUser> {
        const user = await this.userRepository.getUserById(userId);
        if(!user)
            throw new Error("user not found");
        return user;
    }
}
