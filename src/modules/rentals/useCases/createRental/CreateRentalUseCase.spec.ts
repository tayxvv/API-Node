import { RentalsRepositoryInMemory } from "@modules/rentals/infra/typeorm/repositories/in-memory/RentalsRepositoryInMemory";
import { CreateRentalUseCase } from "./CreateRentalUseCase"
import { AppError } from "@shared/errors/AppError";
import { DatejsProvider } from "@shared/container/providers/DateProvider/DatejsProvider";
import dayjs from "dayjs";
import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let dayJsProvider: DatejsProvider;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe('', () => {

  const dayAdd24hours = dayjs().add(1, "day").toDate();

    beforeEach(() => {
        rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        dayJsProvider = new DatejsProvider();
        createRentalUseCase = new CreateRentalUseCase(rentalsRepositoryInMemory, dayJsProvider, carsRepositoryInMemory);
    })

  it('should be able to create a new rental', async () => {

    const car = await carsRepositoryInMemory.create({
        name: 'Test',
        description: 'Car Test',
        daily_rate: 100,
        license_plate: 'test',
        fine_amount: 40,
        category_id: '1234',
        brand: 'brand'
    });

    const rental = await createRentalUseCase.execute({
        user_id: '12345',
        car_id: car.id,
        expected_return_date: dayAdd24hours
    });

    expect(rental).toHaveProperty('id');
    expect(rental).toHaveProperty('start_date');
  });

  it('should not be able to create a new rental if there is another open to the same user', async () => {

    await rentalsRepositoryInMemory.create({
      car_id: '1223',
      expected_return_date: dayAdd24hours,
      user_id: '12345'
    })

    await createRentalUseCase.execute({
      user_id: '12345',
      car_id: '121212',
      expected_return_date: dayAdd24hours
    });
    expect(await createRentalUseCase.execute({
            user_id: '12345',
            car_id: '121212',
            expected_return_date: dayAdd24hours
        })
    ).rejects.toEqual(new AppError("There's a rental in progress for user!"));
  });

  it('should not be able to create a new rental if there is another open to the same car', async () => {
    await createRentalUseCase.execute({
      user_id: '12345',
      car_id: '121212',
      expected_return_date: dayAdd24hours
    });
    expect(await createRentalUseCase.execute({
            user_id: '321',
            car_id: '121212',
            expected_return_date: dayAdd24hours
        })
    ).rejects.toEqual(new AppError("Car is unavailable"));
  });

  it('should not be able to create a new rental with invalid return time', async () => {
    
    expect(await createRentalUseCase.execute({
            user_id: '12345',
            car_id: '121212',
            expected_return_date: dayjs().toDate()
        })
    ).rejects.toEqual(new AppError("Invalid return time!"));
  });
})
