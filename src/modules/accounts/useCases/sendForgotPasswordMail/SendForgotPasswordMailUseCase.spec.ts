import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { SendForgotPasswordMailUseCase } from "./SendForgotPasswordMailUseCase"
import { DatejsProvider } from "@shared/container/providers/DateProvider/DatejsProvider";
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory";
import { MailProviderInMemory } from "@shared/container/providers/MailProvider/in-memory/MailProviderInMemory";
import { isAwaitExpression } from "typescript";


let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let dateProvider: DatejsProvider;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let mailProvider: MailProviderInMemory;

describe('Send Forgot Mail', () => {

    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory();
        dateProvider = new DatejsProvider();
        usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
        mailProvider = new MailProviderInMemory();
        sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
            usersRepositoryInMemory,
            usersTokensRepositoryInMemory,
            dateProvider,
            mailProvider
        )
    })

  it('should be able to send forgot mail to user', async () => {

    const sendMail = spyOn(mailProvider, "sendMail");

    await usersRepositoryInMemory.create({
        driver_license: '000123',
        email: 'XXXXXXXXXXXXX',
        name: 'XXXXXXXXXXXXX',
        password: 'XXXXXXXXXXXXX'
    });

    await sendForgotPasswordMailUseCase.execute('XXXXXXXXXXXXX');

    expect(sendMail).toHaveBeenCalled();

  });

  it('should not be able to send an email if user does not exists', async () => {
    await expect(sendForgotPasswordMailUseCase.execute('XXXXXXXXXXXXX'))
    .rejects.toEqual(new Error('User does not exists!'));
  });

  it('should be able to create an users token', async () => {
    const generateTokenMail = spyOn(usersTokensRepositoryInMemory, "create");
    usersRepositoryInMemory.create({
        driver_license: '000123',
        email: 'XXXXXXXXXXXXX',
        name: 'XXXXXXXXXXXXX',
        password: 'XXXXXXXXXXXXX'
    });

    await sendForgotPasswordMailUseCase.execute('XXXXXXXXXXXXX');

    expect(generateTokenMail).toBeCalled();
  });
})
