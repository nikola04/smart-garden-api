import User from "@/models/user.model";
import { UserDocument } from "@/types/user";

export class UserRepository {
    public async getUserById(userId: string): Promise<UserDocument|null> {
        const user = await User.findById(userId);
        return user;
    }
    public async getUserByEmail(email: string): Promise<UserDocument|null> {
        const user = await User.findOne({ email });
        return user;
    }
}
