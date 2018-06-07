const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const movieSchima = new Schema({
    cover : String ,
    thumbnail : String,
    trailer : String,
    title: { type:String , required: true },
    genre : String,
    director: String,
    imdb : String,
    description : String,
    about : String,
    status : Boolean,
    slider : Boolean,
    language: { type:String , required: true }
});


const Movie = mongoose.model('movie' , movieSchima );

module.exports = Movie;




// asd

