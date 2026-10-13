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
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

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
