const router = require("express").Router();
const passport = require("../authentication/auth");
const personModel = require("../models/person");

// Create
router.post("/", async (req, res) => {
  try {
    const personData = req.body;
    const existingPerson = await personModel.exists({
      username: personData.username,
    });
    if (existingPerson) {
      return res.status(409).send("Username already exists");
    }

    const newPerson = new personModel(personData);
    const savedPerson = await newPerson.save();

    res.status(201).json({
      message: "Person created successfully",
      person: savedPerson,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).send("Username already exists");
    }

    return res.status(400).send("Error creating person: " + error.message);
  }
});

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

router.get("/:role", async (req, res) => {
  try {
    const role = req.params.role;
    // Allowed Role
    const allowedRoles = personModel.schema.path("work").enumValues;
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
