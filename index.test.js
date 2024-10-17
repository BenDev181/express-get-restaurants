const request = require("supertest");
const app = require("./src/app.js");
const Restaurant = require("./models");
const syncSeed = require("./seed.js");
let restQuantity;

beforeAll(async () => {
    await syncSeed()
    const restaurants = await Restaurant.findAll({});
    restQuantity = restaurants.length;
});

test("Test for GET in /restaurants", async () => {
    const response = await request(app).get("/restaurants");
    expect(response.statusCode).toEqual(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty("cuisine");
    expect(response.body.length).toEqual(restQuantity);
    expect(response.body).toContainEqual(
        expect.objectContaining({
            id: 1,
            name: "AppleBees",
            location: "Texas",
            cuisine: "FastFood"
        })
    );
});

test("Test for GET /restaurants/:id", async () => {
    const response = await request(app).get("/restaurants/1");
    expect(response.body).toEqual(
        expect.objectContaining({
            id: 1,
            name: "AppleBees",
            location: "Texas",
            cuisine: "FastFood"
        })
    );
});

test("Test for POST /restaurants", async () => {
    const response = await request(app)
        .post("/restaurants")
        .send({ name: "KFC", location: "New York", cuisine: "Southern" });
    expect(response.body.length).toEqual(restQuantity + 1)
})

test("Test for PUT /restaurants/:id", async () => {
    const response = await request(app)
        .put("/restaurants/1")
        .send({ name: "KFC", location: "New York", cuisine: "Southern" });
        const restaurant = await Restaurant.findByPk(1)
    expect(restaurant.name).toBe("KFC")
});

test("Test for DELETE /restaurants/:id", async () => {
    const response = await request(app)
        .delete("/restaurants/1");
    const restaurants = await Restaurant.findAll()
    expect(restaurants.length).toBe(restQuantity)
    expect(restaurants[0].id).not.toBe(1)
});

test("Test for  validating POST /restaurants", async () => {
    const response = await request(app)
        .post("/restaurants")
        .send();
    expect(response.statusCode).toEqual(200);
    const responseData = JSON.parse(response.text);
    //console.log(responseData)
    expect(responseData.error[0]).toEqual({
            type: 'field',       
            msg: 'Invalid value',
            path: 'name',        
            location: 'body'
    });
})
