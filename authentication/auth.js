// Passport.js for authentication
const passport = require("passport");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const Person = require("../models/person");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await Person.findOne({ username });
      if (!user) {
        return done(null, false, { message: "Incorrect Username" });
      }
      const passwordMatch = await user.comparePassword(password);
      if (!passwordMatch) {
        return done(null, false, { message: "Incorrect Password" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

module.exports = passport;
