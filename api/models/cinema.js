const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cinemaSchima = new Schema({
    name: { type:String , required: true },
    language: { type:String , required: true }
});


const Cinema = mongoose.model('cinema' , cinemaSchima );

module.exports = Cinema ;
