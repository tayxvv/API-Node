import { Specification } from "../infra/typeorm/entities/Specification";

interface ISpecificationRepositoryDTO{
    name: string;
    description: string;
}

interface ISpecificationRepository {
    create( { name, description }: ISpecificationRepositoryDTO): Promise<Specification>;
    findByName(name: string): Promise<Specification>;
    findByIds(ids: string[]): Promise<Specification[]>;
}

export { ISpecificationRepository, ISpecificationRepositoryDTO };