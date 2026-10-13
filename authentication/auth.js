// Passport.js for authentication
// const bcrypt = require("bcrypt");
const passport = require("passport");
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
      //what is done(null, user) ?
      // `done(null, user)` is a callback function used in Passport.js to indicate that the authentication process has completed successfully. The first argument (`null`) indicates that there was no error during the authentication process, and the second argument (`user`) is the authenticated user object that will be attached to the request object for further processing in your application.
    } catch (err) {
      return done(err);
    }
  }),
);

module.exports = passport;
