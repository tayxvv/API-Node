import { IRentalRepository } from "@modules/rentals/infra/typeorm/repositories/IRentalRepository";
import { inject, injectable } from "tsyringe";

@injectable()
class ListRentalsByUserUseCase {
    constructor (
        @inject("RentalsRepository")
        private rentalsRepository: IRentalRepository
    ){
        
    }
    async execute(user_id: string){
        const rentalsByUser = await this.rentalsRepository.findByUser(user_id);

        return rentalsByUser
    }
}

export { ListRentalsByUserUseCase };