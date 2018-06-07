const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const hallSchima = new Schema({
    name: { type:String , required: true },
    hall: [{}]
});


const Hall = mongoose.model('hall', hallSchima);


module.exports = Hall;


