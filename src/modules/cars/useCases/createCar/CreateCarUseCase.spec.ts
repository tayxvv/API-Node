import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { CreateCarUseCase } from "./CreateCarUseCase"
import { AppError } from "@shared/errors/AppError";

let createCarUseCase: CreateCarUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe('Create Car', () => {

    beforeEach(() => {
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
    });

  it('should be able to create a new car', async () => {
    const car =await createCarUseCase.execute({
        name: "Name car", 
        description: "Description", 
        daily_rate: 100, 
        license_plate: "ARC-133", 
        fine_amount: 60, 
        brand: "Brand", 
        category_id: "category_id"
    });

    expect(car).toHaveProperty("id");
  });

  it('should not be able to create a car with exists license plate', async () => {
    await createCarUseCase.execute({
      name: "Name car", 
      description: "Description", 
      daily_rate: 100, 
      license_plate: "ARC-133", 
      fine_amount: 60, 
      brand: "Brand", 
      category_id: "category_id"
    });
    expect(await createCarUseCase.execute({
        name: "Name car 2", 
        description: "Description", 
        daily_rate: 100, 
        license_plate: "ARC-133", 
        fine_amount: 60, 
        brand: "Brand", 
        category_id: "category_id"
      })
    ).rejects.toEqual(new AppError("Car already exists!"));
  });

  it('should not be able to create a car with available true by default', async () => {

    const car = await createCarUseCase.execute({
      name: "Name car", 
      description: "Description", 
      daily_rate: 100, 
      license_plate: "ARC-133", 
      fine_amount: 60, 
      brand: "Brand", 
      category_id: "category_id"
    });

    //expect(car.available).toBe(true);
  });
});
