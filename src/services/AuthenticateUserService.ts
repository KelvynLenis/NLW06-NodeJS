import { getCustomRepository } from "typeorm"
import { UsersRepositories } from "../repositories/UsersRepositories"
import { compare } from "bcryptjs";
import { sign } from 'jsonwebtoken';

interface IAuthenticateRequest {
    email: string;
    password: string;
}

class AuthenticateUserService {
    async execute({email, password}: IAuthenticateRequest){
        const usersRespositories = getCustomRepository(UsersRepositories);

        const user = await usersRespositories.findOne(email)

        if(!user){
            throw new Error("Email/password incorrect")
        }

        const passwordMatch = await compare(password, user.password);
    
        if(!passwordMatch){
            throw new Error("Email/password incorrect")
        }

        const token = sign({
            email
        }, "a12dba231b8a8276739813ca536ed0d3", {
            subject: user.id,
            expiresIn: "1d"
        });

        return token;
    }
}

export { AuthenticateUserService }