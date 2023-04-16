import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entitity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {

    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({ id, email: 'foo@gmail.com', password: 'foo123' } as User)
      },
      find: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: 'foo123' } as User])
      },
    }

    fakeAuthService = {
      signup: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User)
      },
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User)
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService
        },
        {
          provide: AuthService,
          useValue: fakeAuthService
        }]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with given email', async () => {
    const users = await controller.findAllUsers('foo@gmail.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('foo@gmail.com');
  })

  it('findUser returns a user with given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  })

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => null;
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException)
  });

  it('signin updates session object and returns user', async () => {
    const session = { userId: 22 };
    const user = await controller.signin({ email: 'foo123@gmail.com', password: 'foo123' }, session);

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });

  it('signup updates session object and returns user', async () => {
    const session = { userId: 22 };
    const user = await controller.signin({ email: 'foo123@gmail.com', password: 'foo123' }, session);

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  })


});
