import auth from "@config/auth";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { sign, verify } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

interface IPayload {
    sub: string;
    email: string;
}

interface ITokenResponse {
    token: string;
    refresh_token: string;
}

@injectable()
class RefreshTokenUseCase {

    constructor(
        @inject("UsersTokensRepository")
        private usersTokensRepository: IUsersTokensRepository,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider)
     {}

    async nexecute(token: string): Promise<ITokenResponse> {
       const decode = verify(token, auth.secret_refresh_token) as IPayload; 
       const user_id = decode.sub;

       const userTokens = await this.usersTokensRepository.findByUserIdAndRefreshToken(user_id, token);

       if (!userTokens) {
           throw new Error("Refresh Token does not exists!");
       }

       await this.usersTokensRepository.deleteById(userTokens.id);

    //    const refresh_token_expires_date = this.dateProvider.addDays(
    //         auth.expires_refresh_token_days
    //    );

       const refresh_token = sign({ email: decode.email }, auth.secret_refresh_token, {
        subject: user_id,
        expiresIn: auth.expires_in_refresh_token
       });

       await this.usersTokensRepository.create({
           user_id,
           refresh_token,
           expires_date: this.dateProvider.addDays(auth.expires_refresh_token_days)
       });

       const newToken = sign({}, auth.secret_token, {
        subject: user_id,
        expiresIn: auth.expires_in_token
    });

       return {
        refresh_token,
        token: newToken
       };
    }
}

export { RefreshTokenUseCase };