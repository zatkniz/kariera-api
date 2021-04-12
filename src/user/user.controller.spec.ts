import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('User Controller', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([
              {
                name: 'Test name',
                surname: 'Test Surname',
                email: 'test@test.grsssszzs',
                id: 1,
                created_at: '2021-04-11T07:04:53.150Z',
                updated_at: '2021-04-11T07:04:53.150Z',
                deleted_at: null,
                email_verified_at: null,
              },
              {
                name: 'Test name 1',
                surname: 'Test Surname 1',
                email: 'test@test.grsssszzs',
                id: 1,
                created_at: '2021-04-11T07:04:53.150Z',
                updated_at: '2021-04-11T07:04:53.150Z',
                deleted_at: null,
                email_verified_at: null,
              },
              {
                name: 'Test name 2',
                surname: 'Test Surname 2',
                email: 'test@test.grsssszzs',
                id: 1,
                created_at: '2021-04-11T07:04:53.150Z',
                updated_at: '2021-04-11T07:04:53.150Z',
                deleted_at: null,
                email_verified_at: null,
              },
            ]),
            remove: jest.fn().mockResolvedValue({
              statusCode: 200,
              message: 'User Deleted Successfully',
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get all users', () => {
    it('should get an array of users', async () => {
      await expect(controller.findAll()).resolves.toEqual([
        {
          name: 'Test name',
          surname: 'Test Surname',
          email: 'test@test.grsssszzs',
          id: 1,
          created_at: '2021-04-11T07:04:53.150Z',
          updated_at: '2021-04-11T07:04:53.150Z',
          deleted_at: null,
          email_verified_at: null,
        },
        {
          name: 'Test name 1',
          surname: 'Test Surname 1',
          email: 'test@test.grsssszzs',
          id: 1,
          created_at: '2021-04-11T07:04:53.150Z',
          updated_at: '2021-04-11T07:04:53.150Z',
          deleted_at: null,
          email_verified_at: null,
        },
        {
          name: 'Test name 2',
          surname: 'Test Surname 2',
          email: 'test@test.grsssszzs',
          id: 1,
          created_at: '2021-04-11T07:04:53.150Z',
          updated_at: '2021-04-11T07:04:53.150Z',
          deleted_at: null,
          email_verified_at: null,
        },
      ]);
    });
  });

  describe('delete a user', () => {
    it('should return that it deleted a user', async () => {
      await expect(controller.remove('1')).resolves.toEqual({
        statusCode: 200,
        message: 'User Deleted Successfully',
      });
    });
  });
});
