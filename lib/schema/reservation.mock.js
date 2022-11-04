
const reservationBase = {
  party: 6,
  name: "Juan",
}
const reservationOptional = {
  ...reservationBase,
  email: "test@test.com",
}
const reservationRequired = {
  ...reservationBase,
  email: "test@test.com",
  date: "2017/06/10",
  time: "06:02 AM",
}

const reservationRequiredBadInput = {
  ...reservationBase,
  email: "juandaosp",
  date: "2017/06/10",
  time: "06:02 AM",
}

const reservationMock = {
  ...reservationRequired,
  phone: "phone",
  message: "This is a reservation test message",
  datetime: "2017-06-10T06:02:00.000Z"
}

module.exports = Object.freeze({
  reservationRequired: reservationRequired,
  reservationOptional: reservationOptional,
  reservationRequiredBadInput: reservationRequiredBadInput,
  reservationMock: reservationMock,
  emailErrorMessage: `"email" must be a valid email`
});
