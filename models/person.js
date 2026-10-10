const mongoose = require("mongoose");

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
    enum: ["Owner","Manager", "Chef", "Waiter", "Cleaner"],
  },
});

const person = mongoose.model("Person", personSchema);
module.exports = person;
