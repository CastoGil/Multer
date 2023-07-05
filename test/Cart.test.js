import chai from "chai";
import supertest from "supertest";
import myHttpServer from "../src/app.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const expect = chai.expect;
const request = supertest(myHttpServer);

describe("Cart Router", () => {
  let cid;
  it("should create a new cart", async function () {
    this.timeout(10000);
    const response = await request.post("/api/carts").expect(201);
    expect(response.body).to.have.property("id");
    expect(response.body).to.have.property("products").that.is.an("array");
    cid = response.body.id;
  });

  it("should get the cart by ID", async function () {
    const response = await request.get(`/api/carts/${cid}`).expect(200);
    expect(response.body).to.have.property("id").that.equals(cid);
    expect(response.body).to.have.property("products").that.is.an("array");
  });

  it("should add a product to the cart", async function () {
    const productId = "63fed53d53098410590f37ec"; // Reemplazar con un ID de producto válido
    const token = jwt.sign({ role: "premium" }, JWT_SECRET); 
    const response = await request
      .post(`/api/carts/${cid}/products/${productId}`)
      .set("Cookie", `token=${token}`) 
      .expect(200);
  
    expect(response.body).to.have.property("id").that.equals(cid);
    expect(response.body).to.have.property("products").that.is.an("array");
    const addedProduct = response.body.products.find(
      (product) => product.id === productId
    );
    expect(addedProduct).to.exist;
    expect(addedProduct).to.have.property("quantity").that.equals(1);
  });
  
});
