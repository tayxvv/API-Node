import { Repository, getRepository } from "typeorm";
import { ICreateUserDTO } from "../../../dtos/ICreateUserDTO";
import { IUsersRepository } from "../../../repositories/IUsersRepository";
import { User } from "../entities/User";

class UsersRepository implements IUsersRepository {
    private respository: Repository<User>;

    constructor() {
        this.respository = getRepository(User);
    }

    async create({ name, email, driver_license, password, avatar, id }: ICreateUserDTO): Promise<void> {
        
        const user = this.respository.create({
            name,
            email, 
            driver_license, 
            password,
            avatar,
            id
        });

        await this.respository.save(user);
    }

    async findByEmail(email: string): Promise<User> {
        const user = await this.respository.findOne({ email })

        return user;
    }

    async findById(id: string): Promise<User> {
        const user = await this.respository.findOne(id);
        return user;
    }
}

export { UsersRepository }