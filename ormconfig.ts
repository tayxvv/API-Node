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
    migrations: ["./src/database/migrations/*.ts"],
    // subscribers: ['src/subscriber/**/*{.ts,.js}'],
});

// {
//     "type": "postgres",
//     "port": 5432,
//     "host": "localhost",
//     "username": "postgres",
//     "password": "@postgres",
//     "database": "rentx",
//     "migrations": ["./src/database/migrations/*.ts"],
//     "cli": {
//         "migrationsDir": "src/database/migrations"
//     }
// }