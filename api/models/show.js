const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const showSchima = new Schema({
    movie: {type: Schema.Types.ObjectId, ref: 'movie'},
    cinema: {type: Schema.Types.ObjectId, ref: 'cinema'},
    starttime: { type:Date , required: true },
    endTime: { type:Date, required: true },
    hall: {type: Schema.Types.ObjectId, ref: 'hall'}
});


const Show = mongoose.model('show', showSchima);


module.exports = Show;


