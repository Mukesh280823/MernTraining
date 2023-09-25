const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        // required: true,
        // trim: true,
    },
    lastName: {
        type: String,
        // required: true,
        // trim: true,
    },
    email: {
        type: String,
        unique: true,
       
    },
    password: {
        type: String,
       
    }
});

// we need a create a Collection 
const User = mongoose.model('User', userSchema);
module.exports = User;
