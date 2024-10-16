const express = require("express");
const app = express();
const Restaurant = require("../../models/Restaurant.js")
const db = require("../../db/connection.js");
const { where } = require("sequelize");

const router = express.Router()
const {check, validationResult} = require("express-validator")

app.use(express.json());
app.use(express.urlencoded({extended: true}));

router.get("/", async (req, res) => {
    let restaurants = await Restaurant.findAll()
    res.json(restaurants)
})

router.get("/:id", async (req, res) => {
    const id = req.params.id
    let restaurant = await Restaurant.findByPk(id)
    res.json(restaurant)
})

router.post("/", [
    check("name").not().isEmpty().trim(),
    check("location").not().isEmpty().trim(),
    check("cuisine").not().isEmpty().trim()
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.json({error: errors.array()})
    } else {
        const restaurant = await Restaurant.create(req.body)
        let restaurants = await Restaurant.findAll()
        res.json(restaurants)
    }
})

router.put("/:id", async (req, res) => {
    const updatedRestaurant = await Restaurant.update(req.body, {where: {id: req.params.id}});
    let restaurants = await Restaurant.findAll()
    res.json(restaurants)
})

router.delete("/:id", async (req, res) => {
    const deletedRestaurant = await Restaurant.destroy({where: {id: req.params.id}})
    let restaurants = await Restaurant.findAll()
    res.json(restaurants)
})

module.exports = router;