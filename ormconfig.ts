import { DataSource } from 'typeorm';
export const connectionSource = new DataSource({
    migrationsTableName: 'migrations',
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '@postgres',
    database: 'rentx',
    logging: false,
    synchronize: false,
    name: 'default',
    // entities: ['src/**/**.entity{.ts,.js}'],
    migrations: ["./src/shared/infra/typeorm/*.ts"],
    // subscribers: ['src/subscriber/**/*{.ts,.js}'],
});

// {
//     "type": "postgres",
//     "port": 5432,
//     "host": "localhost",
//     "username": "postgres",
//     "password": "@postgres",
//     "database": "rentx",
//     "migrations": ["./src/shared/infra/typeorm/migrations/*.ts"],
//     "entities": ["./src/modules/**/entities/*.ts"],
//     "cli": {
//         "migrationsDir": "src/shared/infra/typeorm/migrations"
//     }
// }