const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  work: {
    type: String,
    required: true,
    enum: ["Owner", "Manager", "Chef", "Waiter", "Cleaner"],
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

personSchema.pre("save", async function () {
  const person = this;
  if (!person.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  person.password = await bcrypt.hash(person.password, salt);
});

// New method built using bcrypt to compare passwords
// what is personSchema.methods.comparePassword ?
// `personSchema.methods.comparePassword` is a method defined on the `personSchema` that allows instances of the `Person` model to compare a provided password (the candidate password) with the hashed password stored in the database.

personSchema.methods.comparePassword = async function (candidatePassword) {
  const person = this;
  try {
    const isMatch = await bcrypt.compare(candidatePassword, person.password);
    return isMatch;
  } catch (error) {
    throw  error;
  }
}

const person = mongoose.model("Person", personSchema);
module.exports = person;
