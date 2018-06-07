const express = require('express');
const router = express.Router();

const Movie = require('../models/movie');

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cd) {
        cd(null, './uploads');
    },
    filename: function (req, file, cd) {
        cd(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

const upload = multer({storage: storage});

// GET ALL ITEMS

router.get('/', (req, res, next) => {

    let start;
    let end;
    if (req.query.start) {
        start = req.query.start * 1;
    }
    if (req.query.end) {
        end = req.query.end * 1;
    }

    let querylike = {};

    let querytags = {};

    if (req.query.tags) {

        querylike.tags = {$all: req.query.tags};

    }
    if (req.query.like) {
        querylike.title = {$regex: new RegExp(req.query.like, "i")};
    }


    console.log(querylike);


    Movie.find(querylike)
        .exec()
        .then((decs) => {
            if (decs.length > 0) {
                res.send(decs)
            }
            else {
                res.send({})
            }
        })
        .catch(err => {
            res.status(500).json({error: err})
        });


});

// GET ALL ITEMS END
// ADD ITEM

router.post('/', upload.array('file', 3), (res, req, next) => {
    const item = new Movie({
        cover : res.files[0].path,
        thumbnail : res.files[1].path,
        trailer : res.files[2].path,
        title: res.body.title,
        genre : res.body.genre,
        director: res.body.director,
        imdb : res.body.imdb,
        description : res.body.description,
        about : res.body.about,
        status : res.body.status,
        slider : res.body.slider,
        language: res.body.language,
    });
    item.save()
        .then((result) => {
            // res.status(500).json({ res: result });
        })
        .catch(function (err, next) {
            console.log(err);
            // res.status(500).json({ error: err });
        });
});

// ADD ITEM END

// GET BY ID

router.get('/:movieid' , (req , res, next) => {
    const id = req.params.movieid;
    Movie.findById(id, function(error, user) {
        console.log(error,user)
    })
        .exec()
        .then(doc => {
            res.status(200).json(doc);
        })
        .catch( err => {
            console.log( err );
            res.status(500).json({ error: err });
        });
});

// GET BY ID END

module.exports = router;

