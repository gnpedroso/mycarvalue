import { Injectable, NotFoundException } from '@nestjs/common';
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

    findOne(id: number) {
        if (!id) {
            return null;
        }
        return this.repo.findOneBy({ id });
    }

    find(email: string) {
        return this.repo.find({ where: { email } });
    }

    // Partial<User> means that attrs can have id, email or password, or none of them 
    async update(id: number, attrs: Partial<User>) {
        const user = await this.findOne(id);
        if (!user) throw new NotFoundException('user not found!');
        Object.assign(user, attrs);
        return this.repo.save(user);
    }

    async remove(id: number) {
        const user = await this.findOne(id);
        if (!user) throw new NotFoundException('user not found!');
        return this.repo.remove(user);
    }
}
