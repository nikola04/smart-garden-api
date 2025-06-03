import User from "@/models/user.model";
import { IUser } from "@/types/user";

export class UserRepository {
    private static instance: UserRepository;
    constructor() {
        if (UserRepository.instance) {
            return UserRepository.instance;
        }
        UserRepository.instance = this;
    }
    public async registerUser(name: string, email: string, password: string): Promise<IUser> {
        const user = await User.create({ name, email, password });
        return user;
    }
    public async getUserById(userId: string): Promise<IUser|null> {
        const user = await User.findById(userId);
        return user;
    }
    public async getUserByEmail(email: string): Promise<IUser|null> {
        const user = await User.findOne({ email });
        return user;
    }
    public async getUserByGoogle(googleId: string): Promise<IUser|null> {
        const user = await User.findOne({ googleId });
        return user;
    }
}
