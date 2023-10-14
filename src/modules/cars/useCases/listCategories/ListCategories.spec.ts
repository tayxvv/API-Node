import { app } from "@shared/infra/http/app";
import request from "supertest";
import { v4 as uuidV4 } from "uuid";
import createConnection from "@shared/infra/typeorm";
import { Connection } from "typeorm";
import { hash } from "bcrypt";

let connection: Connection;

describe('List Category Controller', () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("admin", 8);

    await connection.query(`
        INSERT INTO users(id, name, email, password, driver_license, isAdmin, created_at)
        values('${id}', 'admin', 'XXXXXXXXXXXXXXXXXX', '${password}', 'admin', true, NOW())
    `)
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it('should be able to list all categories', async () => {

    const responseToken = await request(app).post("/sessions").send({
      email: "XXXXXXXXXXXXXXXXXX",
      password: "admin"
    });

    const { refresh_token } = responseToken.body;

    console.log(responseToken.body);

    await request(app).get("/categories")
    .send({
        name: "Category Test",
        description: "Category description test"
    })
    .set({
        Authorization: `Bearer ${refresh_token}`
    });

    const response = await request(app).get("/categories")

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0].name).toEqual("Category Test");
  });
})
