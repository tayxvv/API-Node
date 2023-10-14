import { AppError } from "@shared/errors/AppError";
import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory";
import { DatejsProvider } from "@shared/container/providers/DateProvider/DatejsProvider";

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryMemory: UsersRepositoryInMemory;
let userTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;
let dateProvider: DatejsProvider;

describe('Authenticate User', () => {

    beforeEach(() =>  {
        usersRepositoryMemory = new UsersRepositoryInMemory();
        userTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
        dateProvider = new DatejsProvider();
        authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryMemory, userTokensRepositoryInMemory, dateProvider);
        createUserUseCase = new CreateUserUseCase(usersRepositoryMemory);
    })

  it('should be able to authenticate an user', async () => {
    const user: ICreateUserDTO = {
        driver_license: '000123',
        email: "uset@test.com",
        password: '1234',
        name: "User Test"
    };

    await createUserUseCase.execute(user)
    const result = await authenticateUserUseCase.execute({
        email: user.email,
        password: user.password
    });

    expect(result).toHaveProperty("token");
  });

  it("should not be able to authenticate an nonexistente user", async () => {
    expect(await authenticateUserUseCase.execute({
            email: 'false@gmail.com',
            password: '1233'
        })
    ).rejects.toEqual(new AppError("Email or password incorrect!"))
  });

  it('should not be able to authenticate with incorrect password', async () => {
    // expect(async () => {
    //     const user: ICreateUserDTO = {
    //         driver_license: '000123',
    //         email: 'user@user.com',
    //         password: '1234',
    //         name: 'User Test Error'
    //     };

    //     await createUserUseCase.execute(user);

    //     await authenticateUserUseCase.execute({
    //         email: user.email,
    //         password: 'Incorrect Password'
    //     });
    // }).rejects.toBeInstanceOf(AppError);
    const user: ICreateUserDTO = {
        driver_license: '000123',
        email: 'user@user.com',
        password: '1234',
        name: 'User Test Error'
    };

    await createUserUseCase.execute(user);
    await expect(authenticateUserUseCase.execute({
            email: "email@gmail.com",
            password: 'Incorrect Password'
        })
    ).rejects.toEqual(new AppError("Email or password incorrect!"))
  })
})
