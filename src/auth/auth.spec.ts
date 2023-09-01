import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from 'src/Prisma/prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HelperResponse } from 'src/utils/HelperResponse';
import { Encyption } from 'src/utils/EncryptAndDecrypt';

describe('AuthController', () => {
  let app: INestApplication;
  let authService: AuthService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, PrismaService, HelperResponse],
    }).compile();

    app = moduleFixture.createNestApplication();
    authService = moduleFixture.get<AuthService>(AuthService);
    prismaService = moduleFixture.get<PrismaService>(PrismaService);

    await app.init();
  });

  describe('Register', () => {
    it('should register a new user', async () => {
      const authDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpassword',
      };

      const createUserMock = jest
      .spyOn(prismaService.user, 'create')
      .mockResolvedValue({
        id: 'mockedUserId',
        created_at: new Date(),
        ...authDto,
      });
      const hashingPasswordMock = jest
        .spyOn(Encyption.prototype, 'hashingPassword')
        .mockReturnValue('hashedPassword');

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(authDto);

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.message).toBe('Success Create User');
      expect(response.body.data.username).toBe(authDto.username);

      expect(createUserMock).toHaveBeenCalledWith({
        data: {
          username: authDto.username,
          password: 'hashedPassword',
          email: authDto.email,
        },
      });

      expect(hashingPasswordMock).toHaveBeenCalledWith(authDto.password);
    });

    it('should return error response if email already exists', async () => {
      const authDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpassword',
      };

      const findUniqueMock = jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue({
            id: 'mockedUserId',
            created_at: new Date(),
            ...authDto,
          });

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(authDto);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.message).toBe('Email Telah Terdaftar');

      expect(findUniqueMock).toHaveBeenCalledWith({
        where: {
          email: authDto.email,
        },
      });
    });

    it('should return error response for invalid input', async () => {
      const authDto = {
        username: '',
        email: 'test@example.com',
        password: '',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(authDto);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.message).toBe('Field Tidak Boleh Kosong');
    });

    it('should return error response for Zod error', async () => {
      const authDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpassword',
      };



      const createUserMock = jest
        .spyOn(prismaService.user, 'create')


      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(authDto);

      expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(response.body.message).toBe('Error Dari Zod');
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
