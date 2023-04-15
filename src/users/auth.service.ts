import { UsersService } from "./users.service";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(private usersServices: UsersService) { }

    async signup(email: string, password: string) {
        // See if email is in use
        const users = await this.usersServices.find(email);
        if (users.length > 0) {
            throw new BadRequestException('email in use');
        }

        // Hash the user's password
        // Generate a salt
        const salt = randomBytes(8).toString('hex');

        // Hash the salt and the password together
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        // Join the hashed result and the sal together
        const result = salt + '.' + hash.toString('hex');

        // Create a new user and save it 
        const user = await this.usersServices.create(email, result);

        // return the user
        return user
    }

    async signin(email: string, password: string) {
        const [user] = await this.usersServices.find(email);
        if (!user) {
            throw new NotFoundException('user not found!');
        }
        const [salt, storedHash] = user.password.split('.');
        // Hash the salt and the password together
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        if (storedHash !== hash.toString('hex')) {
            throw new BadRequestException('wrong password')
        }
        return user;
    }
}