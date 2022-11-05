const request = require("supertest");
const { reservationRequiredBadInput, reservationRequired } = require("../lib/schema/reservation.mock");
let app;

const mockMorgan = jest.fn((req, res, next) => next());

beforeAll(() => {
  jest.mock("morgan", () => () => mockMorgan)
  app = request(require("../app"));
});

afterAll(() => {
  jest.unmock("morgan");
});

describe("GET", () => {
  it("should return the reservation form", async () => {
    const response = await app.get("/reservations")
      .expect("Content-type", /html/)
      .expect(200);
    expect(response.text).toContain("To make reservations please fill out the following form");
  });
});

describe("POST", () => {
  it("should reject and invalid reservation request", async () => {
    const response = await app.post("/reservations")
      .type("form")
      .send(reservationRequiredBadInput);
    expect(response.text).toContain("Sorry, there was a problem with your booking request");
    expect(response.status).toBe(400);
  });
  it("should accept a valid reservation request", async () => {
    const response = await app.post("/reservations")
      .type("form")
      .send(reservationRequired)
      .expect(200);
    expect(response.text).toContain("Thanks, your booking request #");
  })
})
