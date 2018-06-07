const express = require('express');
const router = express.Router();

const Show = require('../models/show');
const Movie = require('../models/movie');

// GET ALL ITEMS

function createDateAsUTC(date) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
}

router.get('/', (req, res, next) => {

    let querylike = {};

    if (req.query.curTime && req.query.curTime !== 'undefined') {
        let time = new Date(req.query.curTime);
        let from = new Date(time);
        from.setDate(from.getDate() + 1);
        let to = new Date(time);
        to.setDate(to.getDate());
        querylike.starttime = {$gt: to, $lt: from};
        //

    } else {
        let from = createDateAsUTC(new Date());
        from.setDate(from.getDate());
        let to = createDateAsUTC(new Date());
        to.setDate(to.getDate() - 1);
        querylike.starttime = {$gt: to, $lt: from}
    }

    let monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    let date = [];
    let show = [];

    let all = [];

    Show.find()
        .populate('cinema')
        .populate('movie')
        .exec()
        .then((decs) => {
            if (decs.length > 0) {
                Show.find(querylike)
                    .populate('cinema')
                    .populate('movie')
                    .exec()
                    .then((item) => {

                        // დღეეები

                        decs.forEach(e => {
                            let time = new Date(e.starttime);
                            date.push(e.starttime.getFullYear() + "-" + ( e.starttime.getMonth() + 1 ) + "-" + e.starttime.getDate());
                        });
                        date = date.filter((item, pos) => {
                            return date.indexOf(item) === pos;
                        });

                        // დღეეები END

                        item.forEach(s => {
                            if (req.query.cinema && req.query.cinema !== 'undefined') {
                                if (req.query.cinema == s.cinema._id) {
                                    let time = new Date(s.starttime);
                                    if (req.query.show && req.query.show !== 'undefined') {
                                        if (new Date(s.starttime).getHours() === new Date(req.query.show).getHours() && new Date(s.starttime).getMinutes() === new Date(req.query.show).getMinutes()) {
                                        }
                                    } else {
                                        show.push({
                                            id: s._id,
                                            time: s.starttime.getFullYear() + "-" + ( s.starttime.getMonth() + 1 ) + "-" + s.starttime.getDate() + " " + s.starttime.getHours() + ":" + s.starttime.getMinutes()
                                        });
                                    }
                                }
                            } else if (req.query.show && req.query.show !== 'undefined') {
                                if (new Date(s.starttime).getHours() === new Date(req.query.show).getHours() && new Date(s.starttime).getMinutes() === new Date(req.query.show).getMinutes()) {
                                }
                            } else {
                                let time = new Date(s.starttime);
                                show.push({
                                    id: s._id,
                                    time: s.starttime.getFullYear() + "-" + ( s.starttime.getMonth() + 1 ) + "-" + s.starttime.getDate() + " " + s.starttime.getHours() + ":" + s.starttime.getMinutes(),
                                    movie: s.movie,
                                    cinema: s.cinema
                                });
                            }
                            // show = show.filter((item, pos) => {
                            //     return show.indexOf(item) === pos;
                            // });
                        });
                        all = {
                            time: new Date(),
                            date: date,
                            show: show,
                        };

                        res.send(all);
                    });
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

router.post('/', (res, req, next) => {
    const item = new Show(res.body);
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

router.get('/:showid', (req, res, next) => {
    const id = req.params.showid;

    let activeshow = [];
    let item = [];
    let show = [];
    let cinema = [];
    let date = [];


    let all = [];
    let querylike = {};

    querylike._id = {$eq: id};


    Show.find(querylike)
        .populate('cinema')
        .populate('movie')
        .populate('hall')
        .exec()
        .then(doc => {
            doc = doc[0]

            cinema.push(doc.cinema);
            cinema = cinema.filter((item, pos) => {
                return cinema.indexOf(item) === pos;
            });

            activeshow.push({
                id: doc._id,
                starttime: doc.starttime,
                cinemaId: doc.cinema,
                hall: doc.hall
            });

            item = doc.movie;
            // ebee


            let activeDayQuery = {};
            let activeDay = new Date(doc.starttime);

            activeDay.setHours(0);
            activeDay.setMinutes(0);
            activeDay.setSeconds(0);

            console.log(createDateAsUTC(activeDay));


            let timea = createDateAsUTC(activeDay);
            let from = new Date(timea);
            from.setDate(from.getDate() + 1);
            let to = new Date(timea);
            to.setDate(to.getDate());

            activeDayQuery.starttime = {$gt: to, $lt: from};
            activeDayQuery.movie = {$eq: doc.movie._id};


            Show.find(activeDayQuery)
                // .populate('cinema')
                // .populate('hall')
                .exec()
                .then(allitem => {
                    allitem.forEach(e => {
                        let time = new Date(e.starttime);
                        date.push(e.starttime.getFullYear() + "-" + ( e.starttime.getMonth() + 1 ) + "-" + e.starttime.getDate());
                    });

                    all = {
                        all: allitem,
                        time: createDateAsUTC(new Date()),
                        date: date,
                        item: item,
                        cinema: cinema,
                        show: show,
                        activeshow: activeshow,
                    };
                    res.status(200).json(all);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({error: err});
                });

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});


// GET BY ID END

module.exports = router;


