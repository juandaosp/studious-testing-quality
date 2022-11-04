const Reservation = require("./schema/reservation");

const { reservationRequiredBadInput, reservationRequired, emailErrorMessage } = require("./schema/reservation.mock");

describe("fetch ", () => {
  let reservations;
  beforeAll(() => {
    jest.mock("./reservations");
    reservations = require("./reservations");
  });

  afterAll(() => {
    jest.unmock("./reservations");
  });

  it("should be mocked and not create a database record", () => {
    expect(reservations.fetch()).toBeUndefined();
  });
});

describe("save ", () => {
  let reservations;
  const mockDebug = jest.fn();
  const mockInsert = jest.fn().mockResolvedValue([1]);
  beforeAll(() => {
    jest.mock("debug", () => () => mockDebug);
    jest.mock("./knex", () => () => ({ insert: mockInsert }));
    reservations = require("./reservations");
  });

  afterAll(() => {
    jest.unmock("debug");
    jest.unmock("./knex");
  });

  it("should resolve with the id upon success", async () => {
    const value = { val: "value" };
    const expected = [1];
    const actual = await reservations.save(value);

    expect(actual).toStrictEqual(expected);
    expect(mockDebug).toBeCalledTimes(1);
    expect(mockInsert).toBeCalledWith(value);
  });
});

describe("validate ", () => {
  let reservations;
  beforeAll(() => {
    reservations = require("./reservations");
  });
  it("should resolve with no optional fields", async () => {
    const reservationSchema = new Reservation(reservationRequired);
    const validateReservation = await reservations.validate(reservationSchema);
    expect(validateReservation).toEqual(reservationSchema);
  });

  it("should reject with invalid email", async () => {
    const reservationSchema = new Reservation(reservationRequiredBadInput);
    try {
      await reservations.validate(reservationSchema);
    } catch (error) {
      expect(error.message).toMatch(emailErrorMessage);
    }
  });

  it("should be called and reject empty input", async () => {
    const mock = jest.spyOn(reservations, "validate");
    const value = undefined;
    const error = new Error("Cannot read properties of undefined (reading 'validate')");
    try {
      await reservations.validate(value);
    } catch (err) {
      expect(err).toEqual(error);
    }
    expect(mock).toHaveBeenCalledWith(value);
    mock.mockRestore();
  });
});

describe("create", () => {
  let reservations;
  beforeAll(() => {
    reservations = require("./reservations");
  });
  it("should reject if validation fails", async () => {
    const original = reservations.validate;
    const error = new Error("fail");
    reservations.validate = jest.fn(() => Promise.reject(error))
    await expect(reservations.create())
      .rejects.toBe(error);
    expect(reservations.validate).toBeCalledTimes(1);
    reservations.validate = original;
  });

  it("should reject if validation fails", async () => {
    const mock = jest.spyOn(reservations, "validate");
    const error = new Error("fail");
    mock.mockImplementation(() => Promise.reject(error));
    const value = "puppy"
    try {
      await reservations.create(value);
    } catch(err) {
      expect(err).toEqual(error);
    }
    expect(mock).toHaveBeenCalledWith(value);
    mock.mockRestore();
  });
});
