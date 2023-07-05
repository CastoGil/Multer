import chai from "chai";
import supertest from "supertest";
import myHttpServer from "../src/app.js";
import { faker } from "@faker-js/faker";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const expect = chai.expect;
const request = supertest(myHttpServer);

describe("Products Router", () => {
  it("should render the main products page", async function () {
    this.timeout(10000);
    const response = await request.get("/api/products");
    expect(response.status).to.equal(200);
    expect(response.text).to.be.a("string");
  });

  it("should get a product by ID", async function () {
    const productId = "63fed53d53098410590f37ec"; /// se coloco un ObjectId de un producto ya creado
    const res = await request.get(`/api/products/${productId}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("object");
  });

  it("should create a new product", async function () {
    const productData = {
      title: faker.commerce.productName(),
      description: faker.lorem.sentence(),
      price: faker.commerce.price(),
      thumbnail: faker.image.imageUrl(),
      code: faker.random.alphaNumeric(6),
      stock: faker.datatype.number({ min: 1, max: 50 }),
      category: faker.random.word(),
    };

    const token = jwt.sign({ role: "admin" }, JWT_SECRET);
    const res = await request
      .post("/api/products")
      .send(productData)
      .set("Cookie", `token=${token}`)
      .set("Cookie", "role=admin");
    expect(res.status).to.equal(201);
    expect(res.body).to.be.an("object");
    expect(res.body).to.have.property("_id");
    expect(res.body.title).to.equal(productData.title);
  });
});
