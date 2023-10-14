import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase";

let listCarsUseCase: ListAvailableCarsUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe('List Cars', () => {

    beforeEach(() => {
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        listCarsUseCase = new ListAvailableCarsUseCase(carsRepositoryInMemory);
    })

  it('should be able to list all available cars', async () => {

    await carsRepositoryInMemory.create({
        name: 'Car1',
        description: 'Car description',
        daily_rate: 100,
        license_plate: 'ABC-1234',
        fine_amount: 60,
        brand: 'Car_brand',
        category_id: 'category_id'
    })

    const cars = await listCarsUseCase.execute({
        brand: 'Car_brand',
        category_id: 'category_id',
        name: 'Car1'
    });

    expect(cars).toEqual([cars]);
  });

  it('should be able to list all available cars by name', async () => {
    await carsRepositoryInMemory.create({
        name: 'Car_2',
        description: 'Car description',
        daily_rate: 100,
        license_plate: 'ABC-1234',
        fine_amount: 60,
        brand: 'Car_brand2',
        category_id: 'category_id'
    })

    const cars = await listCarsUseCase.execute({
        name: 'Car_2'
    });

    expect(cars).toEqual([cars]);
  })

})
