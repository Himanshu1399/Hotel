const router = require("express").Router();
const passport = require("../authentication/auth");
const personModel = require("../models/person");

// Create
router.post("/", async (req, res) => {
  try {
    const personData = req.body;
    // Check if the username already exists
    const existingPerson = await personModel.exists({
      username: personData.username,
    });
    if (existingPerson) {
      return res.status(409).send("Username already exists");
    }
    // Create a new person instance and save it to the database
    const newPerson = new personModel(personData);
    const savedPerson = await newPerson.save();

    res.status(201).json({
      message: "Person created successfully",
      person: savedPerson,
    });
  } catch (error) {

    return res.status(400).send("Error creating person: " + error.message);
  }
});

//session: false is used to indicate that we do not want to use sessions for authentication. Instead, we want to use token-based authentication (like JWT) where the client sends the token with each request, and the server verifies it without maintaining a session state.
router.use(passport.authenticate("local", { session: false }));

// Get
router.get("/", async (req, res) => {
  try {
    const data = await personModel.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send("Error retrieving persons: " + error.message);
  }
});

// Find person by role
router.get("/:role", async (req, res) => {
  try {
    const role = req.params.role;
    // Allowed Role
    const allowedRoles = personModel.schema.path("work").enumValues;// ["Owner", "Manager", "Chef", "Waiter", "Cleaner"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).send("Invalid role");
    }
    const Person = await personModel.find({ work: role });
    res.status(200).json(Person);
  } catch (err) {
    res.status(500).send("Internal server error");
  }
});

// Update
router.put("/:id", async (req, res) => {
  try {
    const updatedPerson = await personModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
      //new: true option returns the updated document instead of the original, and runValidators: true ensures that the update operation respects the schema's validation rules.
    );
    if (!updatedPerson) {
      return res.status(404).send("Person not found");
    }
    res.status(200).json(updatedPerson);
  } catch (err) {
    if (err.name === "ValidationError" || err.name === "CastError") {
      return res.status(400).send("Invalid person data: " + err.message);
    }
    res.status(500).send("Internal server error");
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await personModel.findByIdAndDelete(id);
    res.status(200).send(data.name + " Removed Succesfully");
  } catch (err) {
    res.status(500).send("Internal Error");
  }
});

module.exports = router;
