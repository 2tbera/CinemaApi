const express = require('express');
const router = express.Router();

const Hall = require('../models/hall');

// GET ALL ITEMS

router.get('/', (req, res, next) => {

    Hall.find()
        .exec()
        .then((decs) => {
            if (decs.length > 0) {
                res.send(decs)
            }
            else {
                res.status(404).json({message: " Nothing was found !!! "})
            }
        })
        .catch(err => {
            res.status(500).json({error: err})
        });
});

// GET ALL ITEMS END

// ADD ITEM

router.post('/', (res , req, next) => {
    const item = new Hall(res.body);
    item.save()
        .then((result) => {
            res.status(500).json({ res: result });
        })
        .catch(function (err, next) {
            console.log( err );
            res.status(500).json({ error: err });
        });
});

// ADD ITEM END

module.exports = router;