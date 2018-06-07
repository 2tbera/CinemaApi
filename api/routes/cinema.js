const express = require('express');
const router = express.Router();

const Cinema = require('../models/cinema');

// GET ALL ITEMS

router.get('/', (req , res, next) => {

    let querylike = {};


    if(req.query.lg){ querylike.language = { $regex : new RegExp( req.query.lg , "i") } ; }

    console.log(req.query.lg);

    Cinema.find(querylike)
         .exec()
         .then((decs) => {
             if(decs.length > 0){
                res.send(decs )
            }
            else{
                res.status(404).json({ message: " Nothing was found !!! "})
            }
         })
         .catch( err => { res.status(500).json({error: err}) });
});

// GET ALL ITEMS END

// ADD ITEM

router.post('/', (res , req, next) => {
    const item = new Cinema(res.body);
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


// asd add

