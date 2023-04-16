import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entitity";
import { BadRequestException, NotFoundException } from '@nestjs/common';
import e from "express";


describe('AuthService', () => {
    let service: AuthService
    let fakeUsersService: Partial<UsersService>

    beforeEach(async () => {
        const users: User[] = [];

        // Create a fake copy of the users service to add it in DI testing "container"
        fakeUsersService = {
            find: (email: string) => {
                const filteredUsers = users.filter(user => user.email === email);
                return Promise.resolve(filteredUsers);
            },
            create: (email: string, password: string) => {
                const user = { id: Math.floor(Math.random() * 99999), email, password } as User
                users.push(user);
                return Promise.resolve(user);
            }
        }

        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                }]
        }).compile();

        service = module.get(AuthService);
    });

    it('Can create an instance of auth service', async () => {
        expect(service).toBeDefined();
    });

    it('Creates a new user with a salted and hashed password', async () => {
        const user = await service.signup('foo@gmail.com', 'foo123');
        expect(user.password).not.toEqual('foo123');
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });

    it('throws an error if user signs up with email that is in use', async () => {
        await service.signup('foo@foo.com', 'foo123');
        await expect(service.signup('foo@foo.com', 'foo123')).rejects.toThrow(
          BadRequestException,
        );
      });

    it('throws if signin is called with an unused email', async () => {
        await expect(service.signin('foo@gmail.com', 'foo123')).rejects.toThrow(
            NotFoundException
        )
    });

    it('throws if an invalid password is provided', async () => {
        await service.signup('foo@gmail.com', 'foo#$%');

        await expect(service.signin('foo@gmail.com', 'foo123')).rejects.toThrow(
            BadRequestException
        )
    })

    it('returns a user if correct password is provided', async () => {
        await service.signup('foo@gmail.com', 'foo123');

        const user = await service.signin('foo@gmail.com', 'foo123');
        expect(user).toBeDefined();
    })

})
