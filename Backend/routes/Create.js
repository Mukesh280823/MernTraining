const mongoose = require('mongoose');

// create a CreateSchema 
const CreateSchema = new mongoose.Schema({
  
    name: {
        type: String,
        requied: true
    },
    age: {
        type: String,
        requied: true
    },
    address: { type: String, requied: true },
    country: { type: String },
    email: {
        type: String,
        requied: true,
        uniqued: true
    }
});
const CreateModel = mongoose.model("CreateModel", CreateSchema);
module.exports = CreateModel;