const Reservation = require("./reservation")
const { reservationOptional, reservationRequiredBadInput, reservationMock, reservationRequired, emailErrorMessage } = require("./reservation.mock");

describe("create a reservation object ", () => {
  const reservationSchema = new Reservation(reservationRequired);
  it("reservation should match expected props object", () => {
    expect(reservationSchema).toMatchObject(reservationOptional);
  });
  it("should create appropiate datetime string",  () => {
    expect(Reservation.combineDateTime(reservationRequired.date, reservationRequired.time)).toEqual(reservationMock.datetime)
  })
  it("should return null if bad date and time", () => {
    const badDate = "!@#¢", badTime = "fail";
    expect(Reservation.combineDateTime(badDate, badTime)).toBeNull();
  })
});

describe("validate function", () => {

  it("should validate with no optional fields", (done) => {
    const reservationSchema = new Reservation(reservationRequired);
    reservationSchema.validate((error, value) => {
      try {
        expect(value).toEqual(reservationSchema);
        return done(error);
      } catch (err) {
        return done(err);
      }
    });
  });
  it("should invalidate with invalid email", (done) => {
    const reservationSchema = new Reservation(reservationRequiredBadInput);
    reservationSchema.validate((error) => {
      try {
        expect(error.message).toEqual(emailErrorMessage);
        return done();
      } catch (err) {
        return done(err);
      }
    });
  });
});
