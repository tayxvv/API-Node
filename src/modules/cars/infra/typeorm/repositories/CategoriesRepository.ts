import { Category } from "../entities/Category"
import { ICategoriesRepository, ICreateCategoryDTO } from "../../../repositories/ICategoriesRepository";
import { Repository, getRepository } from "typeorm";

//singleton
class CategoriesRepository implements ICategoriesRepository{

    private repository: Repository<Category>;

    constructor() {
        this.repository = getRepository(Category);
    }

    // public static getInstance():CategoriesRepository {
    //     if (!CategoriesRepository.INSTANCE) {
    //         CategoriesRepository.INSTANCE = new CategoriesRepository();
    //     }

    //     return CategoriesRepository.INSTANCE;
    // }

    async create({ name, description }: ICreateCategoryDTO): Promise<void> {

        const category = this.repository.create({
            description,
            name,
        });

        await this.repository.save(category);
    }

    async list(): Promise<Category[]> {
        const categories = await this.repository.find();
        return categories;
    }

    async findByName(name: string): Promise<Category> {
        //select * from categories where name = 'name' limit 1
        const category = await this.repository.findOne({ name });
        return category;
    }
}

export { CategoriesRepository }


// const category = new Category();

// Object.assign(category, {
//     name,
//     description,
//     created_at: new Date()
// });