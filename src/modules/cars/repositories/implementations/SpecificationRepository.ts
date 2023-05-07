import { Specification } from "../../entities/Specification";
import { ISpecificationRepository, ISpecificationRepositoryDTO } from "../ISpecificationRepository";

class SpecificationRepository implements ISpecificationRepository{
    
    private specifications: Specification[];

    constructor() {
        this.specifications = [];
    }

    create({ name, description }: ISpecificationRepositoryDTO): void {
        const specification = new Specification();

        Object.assign(specification, {//vai pegar todas os atributos e passar para o objeto specification
            name,
            description,
            created_at: new Date(),
        });

        this.specifications.push(specification);
    }

    findByName(name: string): Specification {
        const specification = this.specifications.find(
            (specification) => specification.name === name
        );
        return specification;
    }
}

export { SpecificationRepository };