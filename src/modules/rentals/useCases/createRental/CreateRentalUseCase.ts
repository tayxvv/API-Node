import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";
import { IRentalRepository } from "@modules/rentals/infra/typeorm/repositories/IRentalRepository";
import { DatejsProvider } from "@shared/container/providers/DateProvider/DatejsProvider";
import { AppError } from "@shared/errors/AppError";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { inject, injectable } from "tsyringe";

dayjs.extend(utc);

interface IRequest {
    user_id: string;
    car_id: string;
    expected_return_date: Date;
    //id?: string;
}

@injectable()
class CreateRentalUseCase {

    constructor(
        @inject("RentalsRepository")
        private rentalsRepository: IRentalRepository,
        @inject("DatejsProvider")
        private dateProvider: DatejsProvider,
        private carsRepository: ICarsRepository
    ) {
    }

    async execute({ user_id, car_id, expected_return_date }): Promise<void> {

        const minimumHour = 24;

        const carUnavailble = await this.rentalsRepository.findOpenRentalByCar(car_id);

        if (carUnavailble) {
            throw new AppError("Car is unavailable");
        }

        const rentalOpenToUser = await this.rentalsRepository.findOpenRentalByUser(user_id);


        if (rentalOpenToUser) {
            throw new AppError("There's a rental in progress for user!");
        }

        const expectedReturnDateFormat = dayjs(expected_return_date).utc().local().format();
        const dateNow = dayjs().utc().local().format();
        const compare = dayjs(expected_return_date).diff(dateNow, "hours"); 

        //const expectedReturnDateFormat = this.dateProvider.convertToUTC(expected_return_date);

        //const dateNow = this.dateProvider.dateNow();

        //const compare = this.dateProvider.compareInHours(dateNow, expectedReturnDateFormat);

        if (compare < minimumHour) {
            throw new AppError("Invalid return time!");
        }

        this.rentalsRepository.create({
            user_id,
            car_id,
            expected_return_date
        });

        await this.carsRepository.updateAvailable(car_id, false);
    }
}

export { CreateRentalUseCase };