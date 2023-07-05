import chai from "chai";
import supertest from "supertest";
import myHttpServer from "../src/app.js";
import { faker } from "@faker-js/faker";

const expect = chai.expect;
const request = supertest(myHttpServer);

describe("Auth Router - Register", () => {
  it("should register a new user", async function () {
    this.timeout(10000);

    const userData = {
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      age: faker.datatype.number(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const res = await request.post("/auth/register").send(userData);
    expect(res.status).to.equal(302);
    expect(res.headers.location).to.equal("/api/products");
    expect(res.headers).to.have.property("set-cookie");
    // Verificar si la cookie contiene el token
    const tokenCookie = res.headers["set-cookie"].find((cookie) =>
      cookie.includes("token")
    );
    expect(tokenCookie).to.exist;
  });

  it("should return an error if required fields are missing", async () => {
    const userData = {
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
    };

    const res = await request.post("/auth/register").send(userData);
    expect(res.status).to.equal(400);
    expect(res.body).to.have.property("error");
  });

  it("should return an error if email is already registered", async () => {
    const userData = {
      first_name: "John",
      last_name: "Doe",
      age: 25,
      email: "johndoe@example.com",
      password: "password123",
    };
    const registerResponse = await request
      .post("/auth/register")
      .send(userData);
    expect(registerResponse.status).to.equal(200);

    const duplicateResponse = await request
      .post("/auth/register")
      .send(userData);
    expect(duplicateResponse.status).to.equal(200);
    expect(duplicateResponse.text).to.include("El usuario ya está registrado");
  });
});
