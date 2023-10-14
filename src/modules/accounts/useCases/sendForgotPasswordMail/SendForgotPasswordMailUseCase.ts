import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { DatejsProvider } from "@shared/container/providers/DateProvider/DatejsProvider";
import { EtherealMailProvider } from "@shared/container/providers/MailProvider/implementations/EtherealMailProvider";
import { inject, injectable } from "tsyringe";
import { v4 as uuidV4 } from "uuid";
import { resolve } from "path";

@injectable()
class SendForgotPasswordMailUseCase {

    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("UsersTokensRepository")
        private usersTokensRepository: IUsersTokensRepository,
        @inject("DatejsProvider")
        private datejsProvider: DatejsProvider,
        @inject("EtherealMailProvider")
        private etherealMailProvider: EtherealMailProvider
      )  {}

    async execute(email: string) {

        const user = await this.usersRepository.findByEmail(email);

        const templatePath = resolve(__dirname, "..", "..", "views", "emails", "forgotPassword.hbs");

        if (!user) {
            throw new Error("User does not exists!");
        }

        const token = uuidV4();

        const expires_date = this.datejsProvider.addHours(3);

        await this.usersTokensRepository.create({
            refresh_token: token,
            user_id: user.id,
            expires_date: expires_date
        });

        const variables = {
            name: user.name,
            link: `${process.env.FORGOT_MAIL_URL}${token}`
        }

        await this.etherealMailProvider.sendMail(email, "Recuperação", variables, templatePath)

    }
    
}

export { SendForgotPasswordMailUseCase };