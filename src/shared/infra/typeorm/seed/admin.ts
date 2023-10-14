

import { getConnection } from "typeorm";
import { v4 as uuidV4 } from "uuid";
import { hash } from "bcrypt";

import createConnection from "../index";

async function create() {
    const connection = await createConnection("localhost");

    const id = uuidV4();
    const password = await hash("admin", 8);

    await connection.query(`
        INSERT INTO users(id, name, email, password, driver_license, isAdmin, created_at)
        values('${id}', 'admin', 'XXXXXXXXXXXXXXXXXX', '${password}', 'admin', true, NOW())
    `)
}

create().then(() => console.log("User admin created!"));