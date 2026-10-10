const router = require('express').Router();
const menuModel = require('../models/menu');

router.post("/", (req, res) => { 
    try {

        const menuData = req.body;
        const newItem = new menuModel(menuData);
        newItem.save();
        
        res.status(200).json(menuData);
    }
     catch (error) {
        res.status(500).send("Wrong Data");   
    }

})

router.get("/", async (req, res) => { 
    try {
     const data = await menuModel.find();
     res.status(200).json(data);   
    }
    catch (error) {
        res.status(500).send("Error retrieving menu items: " + error.message);
    }
})


module.exports = router;