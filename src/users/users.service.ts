import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entitity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repo: Repository<User>) { }

    create(email: string, password: string) {
        //first create an entity instance, and then save to DB (entity instance can have a validation).
        const user = this.repo.create({ email, password });

        return this.repo.save(user);
    }
}
