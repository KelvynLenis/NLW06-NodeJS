import { getCustomRepository } from 'typeorm';
import { UsersRepositories } from "../repositories/UsersRepositories"
import { hash } from 'bcryptjs';

interface IUserRequest {
    name: string;
    email: string;
    admin?: any;
    password: string;
}

class CreateUserService {

    async execute(name: string, email: string, admin: boolean = false, password: string){
        const usersRepository = getCustomRepository(UsersRepositories);

        if(!email){
            throw new Error("Email incorrect");
        }

        const userAlreadyExists = await usersRepository.findOne(email);

        if(userAlreadyExists){
            throw new Error("user already exists");
        }
        
        let passwordHash = await hash(password, 8);

        const user = usersRepository.create({
            name,
            email,
            admin,
            password: passwordHash,
        } as IUserRequest)

        await usersRepository.save(user);

        return user;
    }
}

export { CreateUserService }